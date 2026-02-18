/**
 * Re-exports computeExtractionOrder from the shared extraction core.
 * The extraction logic lives in lib/chat-extraction.ts to avoid duplication
 * with app/api/chat/route.ts extractContactInfo().
 */
export { computeExtractionOrder } from '@/lib/chat-extraction';
