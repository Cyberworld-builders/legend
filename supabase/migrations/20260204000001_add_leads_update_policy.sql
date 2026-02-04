-- Allow authenticated users to update leads (for status changes in admin dashboard)
CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');
