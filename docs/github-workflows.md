# GitHub Workflows

This document describes the GitHub Actions workflows available in this repository.

## SEO Maintenance Script Automation

> **Note (2026-03-07):** The `seo-maintenance.yml` workflow file has been removed. The index generation step (`npm run generate-post-index`) is now expected to run locally or in the blog publishing agent before committing. See `docs/blog-post-publishing.md` for the current workflow.

A future CI step could re-add automatic index regeneration on PR. The pattern would be:

```yaml
# .github/workflows/update-blog-index.yml (not yet implemented)
on:
  pull_request:
    paths:
      - 'app/blog/posts/*.tsx'

jobs:
  update-index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run generate-post-index
      - run: |
          git diff --quiet lib/post-index.json || {
            git config user.name "github-actions"
            git config user.email "github-actions@github.com"
            git add lib/post-index.json
            git commit -m "chore: regenerate blog post index"
            git push
          }
```

## Other Workflows

### Test Suite

**File:** `.github/workflows/test.yml`

Runs on push and PR to main/develop branches:
- Linting with ESLint
- Build validation tests
- Application build

### Process Voice Memo Transcripts

**File:** `.github/workflows/process-transcripts.yml`

Manual workflow for processing voice memo transcripts (workflow_dispatch only).