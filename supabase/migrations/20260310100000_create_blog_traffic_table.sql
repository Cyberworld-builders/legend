-- Blog traffic metrics from GA4, pushed by GusClaw on a schedule.
-- One row per slug per period (daily or weekly snapshot).

CREATE TABLE IF NOT EXISTS blog_traffic (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL,
    period      TEXT NOT NULL DEFAULT 'daily',  -- 'daily', 'weekly', 'monthly'
    date        DATE NOT NULL,
    views       INTEGER NOT NULL DEFAULT 0,
    sessions    INTEGER NOT NULL DEFAULT 0,
    users       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(slug, period, date)
);

CREATE INDEX idx_blog_traffic_slug ON blog_traffic(slug);
CREATE INDEX idx_blog_traffic_date ON blog_traffic(date DESC);

-- RLS
ALTER TABLE blog_traffic ENABLE ROW LEVEL SECURITY;

-- Service role (GusClaw automation) can do everything
CREATE POLICY "service_role_full_access" ON blog_traffic
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users (admin dashboard) can read
CREATE POLICY "authenticated_read" ON blog_traffic
    FOR SELECT TO authenticated USING (true);
