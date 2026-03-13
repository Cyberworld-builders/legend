import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const GUSCLAW_CHAT_URL = process.env.GUSCLAW_CHAT_URL || 'https://gusclaw-chat.cyberworldbuilders.com';
const CHAT_API_SECRET = process.env.CHAT_API_SECRET || '';

/**
 * POST /api/chat/whisper
 *
 * Asks GusClaw to generate a unique, contextual opening whisper
 * for the terminal based on what page the visitor is viewing.
 * Returns { hook: string, followUp: string }.
 */
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'anonymous';

    const { ok: rateOk } = await checkRateLimit(`whisper:${ip}`);
    if (!rateOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const sessionId: string = body.sessionId || '';
    const pageContext: Record<string, unknown> = body.pageContext || {};

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (CHAT_API_SECRET) {
      headers['X-Chat-Secret'] = CHAT_API_SECRET;
    }

    const gusResponse = await fetch(`${GUSCLAW_CHAT_URL}/chat/whisper`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sessionId,
        pageContext,
      }),
    });

    if (!gusResponse.ok) {
      return NextResponse.json({ error: 'Whisper unavailable' }, { status: 502 });
    }

    const data = await gusResponse.json();
    return NextResponse.json({
      hook: data.hook || '',
      followUp: data.followUp || '',
    });
  } catch (error: unknown) {
    console.error('[whisper] error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
