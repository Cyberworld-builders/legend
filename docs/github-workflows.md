# GitHub Workflows

This document describes the GitHub Actions workflows available in this repository.

## SEO Maintenance Script Automation

**File:** `.github/workflows/seo-maintenance.yml`

This workflow automates SEO maintenance tasks for the blog including:

- Validating frontmatter metadata across all posts
- Updating `lastReviewedDate` for posts older than 90 days
- Regenerating the post index with latest metadata
- Committing and pushing changes back to the specified branch

### Usage

#### Manual Trigger (Workflow Dispatch)

You can manually trigger this workflow from the GitHub Actions tab or using the GitHub CLI:

```bash
# Using GitHub CLI
gh workflow run seo-maintenance.yml -f branch=your-branch-name

# Default branch (117-seo-maintenance-script-automation) will be used if not specified
gh workflow run seo-maintenance.yml
```

#### Input Parameters

- **branch** (required): The branch to checkout and process
  - Default: `117-seo-maintenance-script-automation`
  - The workflow will checkout this branch, run maintenance scripts, and push changes back to it

### What It Does

1. **Checkout**: Checks out the specified branch with full git history
2. **Setup**: Installs Node.js 20.x and npm dependencies
3. **Validate**: Runs metadata validation to identify any issues
4. **Update**: Updates review dates for posts that haven't been reviewed in 90+ days
5. **Generate**: Runs the SEO maintenance script (`npm run seo`) to regenerate post index
6. **Validate**: Re-validates metadata after updates
7. **Commit & Push**: If changes were made, commits them with a descriptive message and pushes to the branch

### Requirements

- The workflow requires `contents: write` permissions to commit and push changes
- The target branch must exist in the repository
- Node.js dependencies must be installable via `npm ci`

### Future Plans

The workflow is designed to eventually trigger automatically on PR opens to main:

```yaml
pull_request:
  branches: [ main ]
  types: [ opened ]
```

This is currently commented out while the workflow is being tested and refined.

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