import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import postIndex from '@/lib/post-index.json';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { extractContactInfo, hasContactInfo } from '@/lib/chat-extraction';

const MAX_HISTORY_MESSAGES = 20;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface PostEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  topics: string[];
}

function getRelevantBlogContent(userQuery: string): PostEntry[] {
  const queryLower = userQuery.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

  if (queryWords.length === 0) return [];

  const scored = (postIndex.posts as PostEntry[]).map(post => {
    let score = 0;

    const title = (post.title || '').toLowerCase();
    queryWords.forEach(word => {
      if (title.includes(word)) score += 5;
    });

    const description = (post.description || '').toLowerCase();
    queryWords.forEach(word => {
      if (description.includes(word)) score += 3;
    });

    const tags = (post.tags || []).join(' ').toLowerCase();
    queryWords.forEach(word => {
      if (tags.includes(word)) score += 2;
    });

    const keywords = (post.keywords || []).join(' ').toLowerCase();
    queryWords.forEach(word => {
      if (keywords.includes(word)) score += 1;
    });

    return { ...post, score };
  });

  return scored
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

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

function buildSystemPrompt(
  relevantContent: PostEntry[],
  userMessageCount: number,
  contactCaptured: boolean,
): string {
  let systemPrompt = `You are Jay's assistant at CyberWorld Builders. Jay Long is a software engineer, founder, and builder. He builds digital marketing systems, business automation, and custom software for service businesses. He's also a drummer, a thinker, and an authentic human who shares real experiences through his blog.

Your voice: warm, direct, technically sharp but approachable. You talk like a real person — not a customer service bot. You can be funny, you can be blunt, you care about the person you're talking to.

RESPONSE FORMAT:
You MUST respond with valid JSON containing these keys:
{
  "message": "Your conversational reply as a plain text string",
  "quickReplies": ["Option 1", "Option 2"]
}

The "quickReplies" array is OPTIONAL. Include 2-3 short options when asking a question to make it easy for the visitor to respond. Each option should be 1-5 words. Omit quickReplies (or use an empty array) when the question is open-ended or you're just making a statement.

IMPORTANT: NEVER include quickReplies about sharing contact info (like "Sure, here's my email" or "Here's my number"). The chat interface will automatically show an email/phone form when appropriate. Do NOT prompt for email or phone via quickReplies.

CONVERSATION STRATEGY:
You help freely but you also move the conversation forward. Think of yourself as a friendly intake coordinator — you want to understand their situation quickly so Jay can help them.

${userMessageCount === 0 ? `This is their FIRST message. Respond helpfully to whatever they say, then immediately ask what kind of project or problem brought them here. Include quickReplies like ["Marketing & Lead Gen", "Custom Software", "Automation", "Just Exploring"].` : ''}

${userMessageCount === 1 ? `This is their SECOND message. You should know what they're interested in. Ask about their business — what industry, how big, what's the main challenge. Include relevant quickReplies.` : ''}

${userMessageCount === 2 ? `This is their THIRD message. Ask for their name if they haven't given it. Be natural: "By the way, what's your name? I like to know who I'm talking to." Do NOT include quickReplies for this — let them type it.` : ''}

${userMessageCount >= 3 && userMessageCount <= 4 && !contactCaptured ? `It's time to ask for contact info. Say something like: "I'd love to have Jay follow up with you personally — drop your email below and he'll reach out within 24 hours." Do NOT include any quickReplies. The chat will show an email input form automatically.` : ''}

${userMessageCount >= 3 && contactCaptured ? `Great — you already have their contact info. Keep being helpful. You can suggest they check out the contact form for more details, or offer to answer more questions. Be warm and supportive.` : ''}

${userMessageCount >= 5 && !contactCaptured ? `You've had a good conversation but don't have contact info yet. Mention casually: "If you'd like Jay to follow up, you can drop your email below or use the contact form at the bottom of the page." Don't push hard. The email form will be visible in the chat.` : ''}

General rules:
- Keep responses to 2-3 sentences max. Be concise.
- Answer their questions genuinely. Don't deflect or withhold.
- When referencing blog posts, include links as /blog/post-slug
- If they ask something off-topic, answer briefly then redirect: "Happy to help with that! By the way..."
- If they give you their name, email, or phone in the chat text, acknowledge it warmly: "Great, I'll make sure Jay sees this!"
- Never be pushy or repetitive about contact info.`;

  if (relevantContent.length > 0) {
    systemPrompt += `\n\nRelevant blog content you can reference:\n`;
    relevantContent.forEach((post, index) => {
      systemPrompt += `${index + 1}. "${post.title}" - ${post.description} (Link: /blog/${post.slug})\n`;
    });
    systemPrompt += `\nReference these when relevant. Include the /blog/slug link.`;
  }

  return systemPrompt;
}

/** Parse LLM JSON response, falling back to plain text if parsing fails. */
function parseLLMResponse(raw: string): { message: string; quickReplies: string[] } {
  try {
    const parsed = JSON.parse(raw);
    return {
      message: typeof parsed.message === 'string' ? parsed.message : raw,
      quickReplies: Array.isArray(parsed.quickReplies)
        ? parsed.quickReplies.filter((r: unknown) => typeof r === 'string').slice(0, 4)
        : [],
    };
  } catch {
    return { message: raw, quickReplies: [] };
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

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userMessageCount = history.filter(m => m.role === 'user').length;

    const allUserMessages: ChatMessage[] = [
      ...history.filter(m => m.role === 'user'),
      { role: 'user', content: message },
    ];
    const contactCaptured = hasContactInfo(allUserMessages);

    const relevantContent = getRelevantBlogContent(message);
    const systemPrompt = buildSystemPrompt(relevantContent, userMessageCount, contactCaptured);

    // Build OpenAI message array from conversation history
    const recentHistory = history.slice(1).slice(-MAX_HISTORY_MESSAGES);
    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map((m): OpenAI.ChatCompletionMessageParam => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: openaiMessages,
    });

    const rawContent = response.choices[0]?.message?.content || '';
    const { message: botMessage, quickReplies } = parseLLMResponse(rawContent);

    const showEmailCapture = userMessageCount >= 3 && !contactCaptured;

    if (sessionId) {
      const allMessages: ChatMessage[] = [
        ...history,
        { role: 'user', content: message, ts: new Date().toISOString() },
        { role: 'bot', content: botMessage, ts: new Date().toISOString() },
      ];
      await upsertChatSession(sessionId, allMessages, page || null);
    }

    return NextResponse.json({
      response: botMessage,
      quickReplies: showEmailCapture ? [] : quickReplies,
      showEmailCapture,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 },
    );
  }
}
