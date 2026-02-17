import type { ChatMessage, ExtractionOrderResult } from '@/types/chats';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

/** Require explicit name-intro phrase (e.g. "I'm John") to avoid misclassifying quick replies like "Automation". */
const NAME_INTRO_REGEX = /^(i'm|my name is|it's|call me|i am|hey,?\s*i'm)\s+/i;

export interface ExtractedContact {
  email: string | null;
  phone: string | null;
  name: string | null;
}

/**
 * Shared extraction core — pure computation, safe for server and client.
 * Yields (field, value, messageIndex) for each contact field as it's first found.
 */
function* extractContactFields(messages: ChatMessage[]): Generator<{ field: 'email' | 'phone' | 'name'; value: string; messageIndex: number }> {
  let emailFound = false;
  let phoneFound = false;
  let nameFound = false;
  let userMessageIndex = -1;

  for (const msg of messages) {
    if (msg.role !== 'user') continue;
    userMessageIndex += 1;
    const text = msg.content;

    if (!emailFound) {
      const match = text.match(EMAIL_REGEX);
      if (match) {
        emailFound = true;
        yield { field: 'email', value: match[0].toLowerCase(), messageIndex: userMessageIndex };
      }
    }

    if (!phoneFound) {
      const match = text.match(PHONE_REGEX);
      if (match) {
        phoneFound = true;
        yield { field: 'phone', value: match[0], messageIndex: userMessageIndex };
      }
    }

    if (!nameFound && text.length < 50 && NAME_INTRO_REGEX.test(text)) {
      const cleaned = text.replace(NAME_INTRO_REGEX, '').trim();
      const words = cleaned.split(/\s+/);
      if (
        words.length >= 1 &&
        words.length <= 4 &&
        /^[A-Za-z\s'-]+$/.test(cleaned) &&
        cleaned.length >= 2
      ) {
        nameFound = true;
        yield { field: 'name', value: cleaned, messageIndex: userMessageIndex };
      }
    }
  }
}

/** Extract email, phone, and name as first-found values (for API/Supabase). */
export function extractContactInfo(messages: ChatMessage[]): ExtractedContact {
  const result: ExtractedContact = { email: null, phone: null, name: null };
  for (const { field, value } of extractContactFields(messages)) {
    if (field === 'email') result.email = value;
    else if (field === 'phone') result.phone = value;
    else if (field === 'name') result.name = value;
  }
  return result;
}

/** Check if contact info (email or phone) has already been captured. */
export function hasContactInfo(messages: ChatMessage[]): boolean {
  const { email, phone } = extractContactInfo(messages);
  return !!(email || phone);
}

/**
 * Compute the order in which contact fields were extracted,
 * including the message index (0-based) where each was first captured.
 */
export function computeExtractionOrder(messages: ChatMessage[]): ExtractionOrderResult {
  const entries = [...extractContactFields(messages)];
  entries.sort((a, b) => a.messageIndex - b.messageIndex);
  return entries;
}
