-- Add failure tracking columns to transcripts
ALTER TABLE transcripts
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS error_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- Index for timeout detection queries
CREATE INDEX IF NOT EXISTS idx_transcripts_claimed_at ON transcripts (claimed_at);

-- Pipeline events audit trail (follows lead_events pattern)
CREATE TABLE IF NOT EXISTS pipeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_type TEXT NOT NULL,       -- claim, transcribe, llm_refine, github_pr, auto_timeout, failed
  step_name TEXT,                 -- human-readable step label
  status TEXT NOT NULL DEFAULT 'completed',  -- started | completed | failed
  event_data JSONB DEFAULT '{}',  -- flexible payload (durations, errors, etc.)
  triggered_by TEXT DEFAULT 'n8n'
);

CREATE INDEX IF NOT EXISTS idx_pipeline_events_transcript_id ON pipeline_events (transcript_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_events_created_at ON pipeline_events (created_at);

-- RLS
ALTER TABLE pipeline_events ENABLE ROW LEVEL SECURITY;

-- Service role: full access
CREATE POLICY "service_role_full_access" ON pipeline_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users: read only
CREATE POLICY "authenticated_select" ON pipeline_events
  FOR SELECT
  TO authenticated
  USING (true);
