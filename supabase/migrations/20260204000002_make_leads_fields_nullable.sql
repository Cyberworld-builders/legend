-- Make leads fields nullable to support email-only submissions
ALTER TABLE leads ALTER COLUMN name DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN project_type DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN budget_tier DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN urgency DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN message DROP NOT NULL;

-- Remove CHECK constraints that prevent NULL values
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_project_type_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_budget_tier_check;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_urgency_check;

-- Re-add CHECK constraints that allow NULL (constraint only fires on non-null values)
ALTER TABLE leads ADD CONSTRAINT leads_project_type_check
  CHECK (project_type IS NULL OR project_type IN ('ai-automation', 'custom-automation', 'web-app', 'consulting', 'other'));

ALTER TABLE leads ADD CONSTRAINT leads_budget_tier_check
  CHECK (budget_tier IS NULL OR budget_tier IN ('under-5k', '5k-10k', '10k-25k', '25k-50k', '50k-plus', 'not-sure'));

ALTER TABLE leads ADD CONSTRAINT leads_urgency_check
  CHECK (urgency IS NULL OR urgency IN ('asap', 'this-month', 'this-quarter', 'exploring'));
