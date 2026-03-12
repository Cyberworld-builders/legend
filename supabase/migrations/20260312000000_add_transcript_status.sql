-- Add status column to transcripts for claimed/processed tracking
-- Prevents duplicate processing when PRs are left unmerged
ALTER TABLE transcripts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Index for the next-unprocessed query filter
CREATE INDEX IF NOT EXISTS idx_transcripts_status ON transcripts(status);
