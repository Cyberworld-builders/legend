-- Chat sessions for conversational lead capture tracking
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Link to page_events session
  session_id TEXT NOT NULL,

  -- Conversation state
  messages JSONB NOT NULL DEFAULT '[]',
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,

  -- Page context
  page TEXT,
  referrer TEXT,

  -- UTM attribution (copied from session at open time)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Phase 2 extraction columns (nullable, no future migration needed)
  extracted_name TEXT,
  extracted_email TEXT,
  extracted_company TEXT,
  extracted_phone TEXT,
  extracted_project_type TEXT,
  extracted_budget TEXT,
  extracted_problems TEXT,
  extracted_how_found TEXT,
  extracted_interests TEXT,
  extraction_ran_at TIMESTAMPTZ,

  -- Lead linkage (Phase 3)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted'))
);

-- Unique on session_id for upsert pattern
CREATE UNIQUE INDEX idx_chat_sessions_session ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_created ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_extracted_email ON chat_sessions(extracted_email)
  WHERE extracted_email IS NOT NULL;

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on chat_sessions" ON chat_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read chat_sessions" ON chat_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Reuse existing trigger function from leads migration
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
