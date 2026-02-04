-- Create transcripts table for voice memo transcripts
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content
  title TEXT NOT NULL,
  transcript_text TEXT NOT NULL,

  -- Processing status
  is_processed BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX idx_transcripts_is_processed ON transcripts(is_processed);
CREATE INDEX idx_transcripts_created_by ON transcripts(created_by);

-- Full-text search on title
CREATE INDEX idx_transcripts_title_fts ON transcripts USING gin(to_tsvector('english', title));

-- Apply the existing updated_at trigger (function created in leads migration)
CREATE TRIGGER update_transcripts_updated_at
  BEFORE UPDATE ON transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access on transcripts" ON transcripts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users can read all transcripts
CREATE POLICY "Authenticated users can read transcripts" ON transcripts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert transcripts
CREATE POLICY "Authenticated users can insert transcripts" ON transcripts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update transcripts
CREATE POLICY "Authenticated users can update transcripts" ON transcripts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete their own transcripts
CREATE POLICY "Authenticated users can delete own transcripts" ON transcripts
  FOR DELETE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid());
