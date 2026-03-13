import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractContactInfo, hasContactInfo } from '@/lib/chat-extraction';

const GUSCLAW_CHAT_URL = process.env.GUSCLAW_CHAT_URL || 'https://gusclaw-chat.cyberworldbuilders.com';
const CHAT_API_SECRET = process.env.CHAT_API_SECRET || '';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  ts?: string;
}

/** Upsert chat conversation to Supabase with extracted fields. */
async function upsertChatSession(
  sessionId: string,
  messages: ChatMessage[],
  page: string | null,
): Promise<void> {
  if (!isServerSupabaseConfigured()) {
    console.log('[chat] Supabase not configured, skipping session storage');
    return;
  }
  try {
    const extracted = extractContactInfo(messages);
    const supabase = createServerClient();
    const { error } = await supabase.from('chat_sessions').upsert(
      {
        session_id: sessionId,
        messages,
        message_count: messages.filter(m => m.role === 'user').length,
        last_message_at: new Date().toISOString(),
        page: page || null,
        status: extracted.email ? 'converted' : 'active',
        ...(extracted.email && { extracted_email: extracted.email }),
        ...(extracted.phone && { extracted_phone: extracted.phone }),
        ...(extracted.name && { extracted_name: extracted.name }),
      },
      { onConflict: 'session_id' },
    );
    if (error) {
      console.error('[chat] chat_sessions upsert error:', error);
    }
  } catch (err) {
    console.error('[chat] chat_sessions upsert exception:', err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId') || '';
    if (!sessionId) {
      return NextResponse.json({ jayMessages: [], jayOnline: false });
    }

    const headers: Record<string, string> = {};
    if (CHAT_API_SECRET) {
      headers['X-Chat-Secret'] = CHAT_API_SECRET;
    }

    const pollUrl = `${GUSCLAW_CHAT_URL}/chat/poll?sessionId=${encodeURIComponent(sessionId)}`;
    const gusResponse = await fetch(pollUrl, { headers });

    if (!gusResponse.ok) {
      return NextResponse.json({ jayMessages: [], jayOnline: false });
    }

    const data = await gusResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ jayMessages: [], jayOnline: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'anonymous';

    const { ok: rateOk } = await checkRateLimit(`chat:${ip}`);
    if (!rateOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const message: string | undefined = body.message;
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const sessionId: string | undefined = body.sessionId;
    const page: string | undefined = body.page;
    const pageContext: Record<string, unknown> | undefined = body.pageContext;
    const funnelActive: boolean = body.funnelActive ?? false;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const allUserMessages: ChatMessage[] = [
      ...history.filter(m => m.role === 'user'),
      { role: 'user', content: message },
    ];
    const contactCaptured = hasContactInfo(allUserMessages);

    // Proxy to GusClaw chat API
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (CHAT_API_SECRET) {
      headers['X-Chat-Secret'] = CHAT_API_SECRET;
    }

    const gusPayload: Record<string, unknown> = {
      message,
      history,
      contactCaptured,
      sessionId: sessionId || '',
    };

    // Forward full page context so GusClaw knows what the visitor is viewing
    if (pageContext) {
      gusPayload.pageContext = pageContext;
    }
    if (page) {
      gusPayload.page = page;
    }
    // Signal whether Jay has timed out — GusClaw should only push
    // for contact capture after this goes true
    gusPayload.funnelActive = funnelActive;

    const gusResponse = await fetch(`${GUSCLAW_CHAT_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(gusPayload),
    });

    if (!gusResponse.ok) {
      const errBody = await gusResponse.text();
      console.error('[chat] GusClaw API error:', gusResponse.status, errBody);
      return NextResponse.json(
        { error: 'Chat service unavailable' },
        { status: 502 },
      );
    }

    const gusData = await gusResponse.json();
    const botMessage: string = gusData.response || 'Sorry, I had a hiccup. Could you try again?';
    const quickReplies: string[] = gusData.quickReplies || [];
    const showEmailCapture: boolean = gusData.showEmailCapture || false;
    const jayMessages: string[] = gusData.jayMessages || [];

    if (sessionId) {
      const allMessages: ChatMessage[] = [
        ...history,
        { role: 'user', content: message, ts: new Date().toISOString() },
        { role: 'bot', content: botMessage, ts: new Date().toISOString() },
      ];
      // Include Jay's messages in the session too
      for (const jm of jayMessages) {
        allMessages.push({ role: 'bot', content: `Jay: ${jm}`, ts: new Date().toISOString() });
      }
      await upsertChatSession(sessionId, allMessages, page || null);
    }

    return NextResponse.json({
      response: botMessage,
      quickReplies,
      showEmailCapture,
      jayMessages,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 },
    );
  }
}
