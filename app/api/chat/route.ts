import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createServerClient, isServerSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_HISTORY_MESSAGES = 20;

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  modelKwargs: { response_format: { type: 'json_object' } },
});

async function getRelevantBlogContent(userQuery: string) {
  try {
    const markdownDir = path.join(process.cwd(), 'app', 'blog', 'posts', 'markdown');
    const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));

    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    const scoredPosts = files.map(filename => {
      const filePath = path.join(markdownDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);

      let score = 0;

      const title = (frontmatter.title || '').toLowerCase();
      queryWords.forEach(word => {
        if (title.includes(word)) score += 5;
      });

      const description = (frontmatter.description || '').toLowerCase();
      queryWords.forEach(word => {
        if (description.includes(word)) score += 3;
      });

      const contentLower = (content || '').toLowerCase();
      queryWords.forEach(word => {
        const wordCount = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += wordCount * 2;
      });

      const tags = (frontmatter.tags || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (tags.includes(word)) score += 2;
      });

      const keywords = (frontmatter.keywords || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (keywords.includes(word)) score += 1;
      });

      return {
        title: frontmatter.title,
        slug: filename.replace('.md', ''),
        description: frontmatter.description,
        topics: frontmatter.topics || [],
        tags: frontmatter.tags || [],
        content: content.substring(0, 300),
        score
      };
    });

    return scoredPosts
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching blog content:', error);
    return [];
  }
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  ts?: string;
}

/** Extract email and phone from all user messages in the conversation. */
function extractContactInfo(messages: ChatMessage[]): { email: string | null; phone: string | null; name: string | null } {
  let email: string | null = null;
  let phone: string | null = null;
  let name: string | null = null;

  for (const msg of messages) {
    if (msg.role !== 'user') continue;
    const text = msg.content;

    if (!email) {
      const emailMatch = text.match(EMAIL_REGEX);
      if (emailMatch) email = emailMatch[0].toLowerCase();
    }

    if (!phone) {
      const phoneMatch = text.match(PHONE_REGEX);
      if (phoneMatch) phone = phoneMatch[0];
    }

    // Name extraction: require explicit name-intro phrase (e.g. "I'm John", "My name is Sarah")
    // to avoid misclassifying quick replies like "Automation", "Custom Software", "Just Browsing"
    const nameIntro = /^(i'm|my name is|it's|call me|i am|hey,?\s*i'm)\s+/i;
    if (!name && text.length < 50 && nameIntro.test(text)) {
      const cleaned = text.replace(nameIntro, '').trim();
      const words = cleaned.split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && /^[A-Za-z\s'-]+$/.test(cleaned) && cleaned.length >= 2) {
        name = cleaned;
      }
    }
  }

  return { email, phone, name };
}

/** Check if contact info has already been captured in the conversation. */
function hasContactInfo(messages: ChatMessage[]): boolean {
  const { email, phone } = extractContactInfo(messages);
  return !!(email || phone);
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
        // Write extracted fields (only overwrite with non-null values)
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
  relevantContent: Awaited<ReturnType<typeof getRelevantBlogContent>>,
  userMessageCount: number,
  contactCaptured: boolean,
): string {
  let systemPrompt = `You are Jay's assistant at CyberWorld Builders. Jay builds digital marketing systems, business automation, and custom software for service businesses.

Your job is to have a helpful conversation AND learn about the visitor so Jay can follow up personally if there's a fit.

RESPONSE FORMAT:
You MUST respond with valid JSON containing these keys:
{
  "message": "Your conversational reply as a plain text string",
  "quickReplies": ["Option 1", "Option 2"]
}

The "quickReplies" array is OPTIONAL. Include 2-3 short options when asking a question to make it easy for the visitor to respond. Each option should be 1-5 words. Omit quickReplies (or use an empty array) when the question is open-ended or you're just making a statement.

IMPORTANT: NEVER include quickReplies about sharing contact info (like "Sure, here's my email" or "Here's my number"). The chat interface will automatically show an email/phone form when appropriate. Do NOT prompt for email or phone via quickReplies.

CONVERSATION STRATEGY:
You are warm and direct. You help freely but you also move the conversation forward. Think of yourself as a friendly intake coordinator — you want to understand their situation quickly so Jay can help them.

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
    systemPrompt += `\n\nRelevant blog content:\n`;
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

    // Count user messages in history to determine conversation stage
    const userMessageCount = history.filter(m => m.role === 'user').length;

    // Check if we already have contact info from the conversation
    const allUserMessages: ChatMessage[] = [
      ...history.filter(m => m.role === 'user'),
      { role: 'user', content: message },
    ];
    const contactCaptured = hasContactInfo(allUserMessages);

    // Get relevant blog content for RAG
    const relevantContent = await getRelevantBlogContent(message);
    const systemPrompt = buildSystemPrompt(relevantContent, userMessageCount, contactCaptured);

    // Build LangChain message array with conversation history
    // Skip the initial welcome bot message (index 0) and cap history length
    const recentHistory = history.slice(1).slice(-MAX_HISTORY_MESSAGES);
    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...recentHistory.map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content),
      ),
      new HumanMessage(message),
    ];

    const response = await llm.invoke(langchainMessages);
    const rawContent = response.content as string;
    const { message: botMessage, quickReplies } = parseLLMResponse(rawContent);

    // Determine whether to show the email capture form
    // Show it when: we're at the contact stage AND we don't have contact info yet
    const showEmailCapture = userMessageCount >= 3 && !contactCaptured;

    // Store conversation — MUST await (serverless kills fire-and-forget)
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
