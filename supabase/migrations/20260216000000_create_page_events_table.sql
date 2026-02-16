-- Page events table for scroll tracking, CTA clicks, and A/B test data
CREATE TABLE IF NOT EXISTS page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  experiment_id TEXT,
  variant TEXT,
  event_data JSONB,
  user_agent TEXT
);

CREATE INDEX idx_page_events_session ON page_events(session_id);
CREATE INDEX idx_page_events_name ON page_events(event_name);
CREATE INDEX idx_page_events_created ON page_events(created_at DESC);
CREATE INDEX idx_page_events_experiment ON page_events(experiment_id) WHERE experiment_id IS NOT NULL;

-- Row Level Security
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on page_events" ON page_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read page_events" ON page_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow anonymous inserts from the /api/track route
CREATE POLICY "Anon can insert page_events" ON page_events
  FOR INSERT WITH CHECK (true);
