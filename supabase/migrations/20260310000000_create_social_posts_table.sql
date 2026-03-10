-- Social media posts — tracks drafts, published posts, and engagement metrics per platform per blog slug.
-- Source of truth for content performance data. GusClaw writes via automation API, admin reads via auth.

CREATE TABLE IF NOT EXISTS social_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Content
  platform      TEXT NOT NULL CHECK (platform IN ('x', 'linkedin', 'facebook')),
  blog_slug     TEXT NOT NULL,
  text          TEXT NOT NULL DEFAULT '',
  url           TEXT,
  image_path    TEXT,

  -- Publishing state
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'failed')),
  post_id       TEXT,          -- platform-specific post ID
  post_url      TEXT,          -- direct link to the post on the platform
  posted_at     TIMESTAMPTZ,
  error_message TEXT,

  -- Engagement metrics (updated periodically by GusClaw)
  impressions   INTEGER,
  clicks        INTEGER,
  likes         INTEGER,
  comments      INTEGER,
  shares        INTEGER,
  metrics_updated TIMESTAMPTZ
);

-- Indexes for common query patterns
CREATE INDEX idx_social_posts_platform ON social_posts (platform);
CREATE INDEX idx_social_posts_blog_slug ON social_posts (blog_slug);
CREATE INDEX idx_social_posts_status ON social_posts (status);
CREATE INDEX idx_social_posts_posted_at ON social_posts (posted_at DESC);
CREATE INDEX idx_social_posts_created_at ON social_posts (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_social_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_social_posts_updated_at();

-- Row Level Security
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Service role: full access (GusClaw automation)
CREATE POLICY "Service role full access on social_posts"
  ON social_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admin): read only
CREATE POLICY "Authenticated users can read social_posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (true);
