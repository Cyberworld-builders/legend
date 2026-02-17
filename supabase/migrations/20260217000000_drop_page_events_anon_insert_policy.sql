-- Remove insecure anon insert policy.
-- The /api/track route uses the service role key (bypasses RLS); anon inserts
-- would bypass rate limiting, event whitelist, and payload validation.
DROP POLICY IF EXISTS "Anon can insert page_events" ON page_events;
