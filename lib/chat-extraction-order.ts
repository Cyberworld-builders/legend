import type { ChatMessage, ExtractionOrderResult } from '@/types/chats';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

/**
 * Compute the order in which contact fields were extracted from the conversation,
 * including the message index (0-based) where each was first captured.
 * Mirrors the logic in app/api/chat/route.ts extractContactInfo().
 */
export function computeExtractionOrder(messages: ChatMessage[]): ExtractionOrderResult {
  const result: ExtractionOrderResult = [];
  let emailFound = false;
  let phoneFound = false;
  let nameFound = false;

  let userMessageIndex = -1;
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== 'user') continue;
    userMessageIndex += 1;
    const text = msg.content;

    if (!emailFound) {
      const emailMatch = text.match(EMAIL_REGEX);
      if (emailMatch) {
        result.push({
          field: 'email',
          value: emailMatch[0].toLowerCase(),
          messageIndex: userMessageIndex,
        });
        emailFound = true;
      }
    }

    if (!phoneFound) {
      const phoneMatch = text.match(PHONE_REGEX);
      if (phoneMatch) {
        result.push({
          field: 'phone',
          value: phoneMatch[0],
          messageIndex: userMessageIndex,
        });
        phoneFound = true;
      }
    }

    if (!nameFound && text.length < 50) {
      const cleaned = text
        .replace(/^(i'm|my name is|it's|call me|i am|hey,?\s*i'm)\s+/i, '')
        .trim();
      const words = cleaned.split(/\s+/);
      if (
        words.length >= 1 &&
        words.length <= 3 &&
        /^[A-Za-z\s'-]+$/.test(cleaned) &&
        cleaned.length >= 2
      ) {
        result.push({
          field: 'name',
          value: cleaned,
          messageIndex: userMessageIndex,
        });
        nameFound = true;
      }
    }
  }

  // Sort by message index so we show collection order
  result.sort((a, b) => a.messageIndex - b.messageIndex);
  return result;
}
