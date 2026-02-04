-- Create lead events table (audit trail)
CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  event_type TEXT NOT NULL CHECK (event_type IN ('form_submit', 'score_calculated', 'status_changed', 'email_sent', 'webhook_sent')),
  event_data JSONB,

  -- Idempotency
  idempotency_key TEXT UNIQUE,

  -- Workflow tracking
  triggered_by TEXT DEFAULT 'api'
);

-- Indexes
CREATE INDEX idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX idx_lead_events_type ON lead_events(event_type);
CREATE INDEX idx_lead_events_idempotency ON lead_events(idempotency_key);
CREATE INDEX idx_lead_events_created_at ON lead_events(created_at DESC);

-- Row Level Security
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON lead_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users can read events
CREATE POLICY "Authenticated users can read events" ON lead_events
  FOR SELECT
  USING (auth.role() = 'authenticated');
