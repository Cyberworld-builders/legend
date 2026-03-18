import { TranscriptUpdateData } from '@/types/transcripts';

/**
 * Maps Zod-parsed transcript update fields to DB update object with auto-timestamps.
 * - status='claimed' -> auto-set claimed_at = now()
 * - status='failed'  -> auto-set error_at = now()
 * - status='pending' -> clear error_message, error_at, claimed_at
 */
export function prepareTranscriptUpdate(parsed: TranscriptUpdateData): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};

  if (parsed.title !== undefined) updateData.title = parsed.title;
  if (parsed.transcript_text !== undefined) updateData.transcript_text = parsed.transcript_text;
  if (parsed.is_processed !== undefined) updateData.is_processed = parsed.is_processed;
  if (parsed.error_message !== undefined) updateData.error_message = parsed.error_message;

  if (parsed.status !== undefined) {
    updateData.status = parsed.status;

    switch (parsed.status) {
      case 'claimed':
        updateData.claimed_at = new Date().toISOString();
        break;
      case 'failed':
        updateData.error_at = new Date().toISOString();
        break;
      case 'pending':
        updateData.error_message = null;
        updateData.error_at = null;
        updateData.claimed_at = null;
        break;
    }
  }

  return updateData;
}
