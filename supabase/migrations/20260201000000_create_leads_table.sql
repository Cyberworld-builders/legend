-- Create leads table for lead capture form
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,

  -- Project details
  project_type TEXT NOT NULL CHECK (project_type IN ('ai-automation', 'custom-automation', 'web-app', 'consulting', 'other')),
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-plus', 'not-sure')),
  urgency TEXT NOT NULL CHECK (urgency IN ('asap', 'this-month', 'this-quarter', 'exploring')),
  message TEXT NOT NULL,

  -- Scoring
  score INTEGER DEFAULT 0,
  score_breakdown JSONB,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),

  -- Attribution
  source_url TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Consent
  consent_marketing BOOLEAN DEFAULT FALSE
);

-- Indexes for common queries
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to leads table
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON leads
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users (future dashboard) can read
CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');
