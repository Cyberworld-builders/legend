# CLAUDE.md - CyberWorld Builders Website

## Project Overview

**cyberworldbuilders.com** is a marketing and content website for CyberWorld Builders, Inc., a software engineering and consulting company. The site features:
- Company landing page with social links and FAQ
- Blog with 20+ technical articles covering AI, automation, career transitions, and development
- AI-powered chat widget that answers questions using blog content
- SEO-optimized content pipeline with automated tag management and social card generation

### Business Purpose
- Establish professional presence and personal brand for Jay Long
- Share technical insights and career experiences through blog content
- Attract consulting leads and demonstrate expertise
- Portfolio showcase for potential clients and partners

---

## Tech Stack

### Framework & Runtime
- **Next.js 15.3.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.9.2** - Type safety
- **Node.js** - Runtime environment

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/typography** - Prose styling for blog content
- **lucide-react & react-icons** - Icon libraries
- Cyberpunk/terminal aesthetic (green on black theme)

### Content & Data
- **gray-matter** - Frontmatter parsing for markdown posts
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub-flavored markdown support
- **react-syntax-highlighter** - Code highlighting in blog posts

### AI & Automation
- **LangChain 0.3.23** - LLM orchestration
- **@langchain/openai** - OpenAI integration
- **OpenAI SDK 4.96.0** - Direct API access
- ChatGPT 3.5-turbo powers the chat widget

### Deployment & Infrastructure
- **Vercel** - Hosting and CI/CD
- **Docker** - Containerization (optional, has Dockerfile)
- **Terraform** - Infrastructure as code (in infrastructure/ directory)

### Testing & Quality
- **Jest 30** - Test framework
- **Puppeteer 24** - Social image generation
- **ESLint** - Code linting

### Integrations (configured in .env)
- **Stripe** - Payment processing (not currently used)
- **Make.com webhooks** - Automation triggers
- **Supabase** - Database (planned but not actively used)
- **Vercel Analytics** - Site analytics

---

## Repository Map

```
legend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage: logo, links, FAQ, chat widget
│   ├── layout.tsx                # Root layout with metadata, fonts, analytics
│   ├── globals.css               # Global styles (Tailwind imports)
│   ├── sitemap.ts                # Dynamic sitemap generation
│   ├── blog/                     # Blog section
│   │   ├── page.tsx              # Blog listing page
│   │   ├── [slug]/page.tsx       # Dynamic blog post pages
│   │   ├── posts/                # Blog post storage
│   │   │   ├── markdown/         # Source markdown files (23 posts)
│   │   │   ├── generated/        # Generated TSX components from markdown
│   │   │   └── template.tsx      # Template for new posts
│   │   ├── tag/[tag]/page.tsx    # Tag filtering pages
│   │   └── tags/page.tsx         # All tags listing
│   └── api/                      # API routes
│       ├── chat/route.ts         # LangChain chat endpoint (RAG on blog content)
│       └── health/route.ts       # Health check endpoint
│
├── components/                   # React components
│   ├── Article.tsx               # Blog post article wrapper
│   ├── AuthorSchema.tsx          # Structured data for author
│   ├── Breadcrumb.tsx            # Navigation breadcrumbs
│   ├── ChatWidget.tsx            # AI chat interface (sticky bottom-right)
│   ├── ChatMessage.tsx           # Individual chat message component
│   ├── FAQ.tsx                   # FAQ accordion on homepage
│   ├── FAQSchema.tsx             # Structured data for FAQ
│   ├── GoogleAnalytics.tsx       # GA4 integration
│   ├── PageBackground.tsx        # Terminal-style animated background
│   ├── PerformanceMonitor.tsx    # Client-side performance tracking
│   ├── RelatedPosts.tsx          # Related posts suggestions
│   ├── SimpleSocialShare.tsx     # Social sharing buttons
│   ├── SocialShare.tsx           # Advanced social sharing
│   └── TopicClusters.tsx         # Topic-based post grouping
│
├── lib/                          # Utility libraries
│   ├── content-utils.ts          # Content processing utilities
│   ├── frontmatter-utils.ts      # Frontmatter parsing and validation
│   ├── generated-posts-index.ts  # Auto-generated post index (TypeScript)
│   ├── post-index.json           # Auto-generated post index (JSON)
│   ├── post-metadata.ts          # Post metadata extraction
│   ├── processed-posts.ts        # Preprocessed post content
│   ├── hardcoded-posts.ts        # Legacy hardcoded posts (deprecated)
│   ├── tag-pages-index.json      # Tag pages lookup table
│   └── generated-tags/           # Auto-generated tag page components
│
├── scripts/                      # Build and content pipeline scripts
│   ├── generate-post-index.js    # Creates post-index.json from markdown
│   ├── generate-tsx-posts.js     # Converts markdown → TSX components
│   ├── generate-tag-json.js      # Creates tag lookup tables
│   ├── generate-tag-pages.js     # Generates tag page components
│   ├── normalize-tags.js         # Normalizes tag formatting (hyphens, lowercase)
│   ├── validate-tags.js          # Validates tags against schema
│   ├── seo-maintenance.js        # SEO health checks and reporting
│   ├── preprocess-content.js     # Content preprocessing pipeline
│   ├── generate-social-image-puppeteer.js  # Social card image generation
│   ├── generate-chatbot-content.js         # Prepares content for chatbot
│   └── chatbot-content-selector-markdown.js  # Content selection for RAG
│
├── public/                       # Static assets
│   ├── images/                   # Images, logo, social cards
│   ├── icons/                    # App icons
│   ├── robots.txt                # Search engine crawling rules
│   └── manifest.json             # PWA manifest
│
├── docs/                         # Documentation
│   ├── blog-system-troubleshooting.md
│   ├── frontmatter-example.md
│   ├── github-workflows.md
│   ├── metadata-system-summary.md
│   ├── seo-analysis-and-improvement-plan.md
│   └── seo-maintenance-guide.md
│
├── __tests__/                    # Jest tests
├── infrastructure/               # Terraform IaC (not actively used)
├── types/                        # TypeScript type definitions
├── .github/                      # GitHub workflows
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies and scripts
├── .env.local                    # Local environment variables
└── .env                          # Environment variables
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm 9+
- OpenAI API key (for chat widget)

### Installation
```bash
# Clone repository
git clone <repo-url>
cd legend

# Install dependencies
npm install

# Copy environment variables
cp .example.env .env.local

# Add your API keys to .env.local
# Required: OPENAI_API_KEY
# Optional: STRIPE keys, SUPABASE keys, MAKE_COM_WEBHOOK_URL
```

### Environment Variables
Required variables (see `.example.env` for full list):
- `OPENAI_API_KEY` - Powers the chat widget (required)
- `NEXT_PUBLIC_MAKE_COM_WEBHOOK_URL` - For future lead capture automation
- `NEXT_PUBLIC_SUPABASE_URL` - Database URL (planned)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database key (planned)

### Running Locally
```bash
# Development server (runs on port 3001)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Run CI tests (build validation)
npm run test:ci
```

### Content Pipeline Commands
```bash
# Generate post index from markdown files
npm run generate-post-index

# Convert markdown posts to TSX components
npm run generate-tsx-posts

# Validate and normalize tags
npm run validate-tags
npm run seo:normalize

# Generate tag pages and JSON lookup
npm run generate-tag-pages
npm run generate-tag-json

# Full SEO pipeline (index + posts + tags + report)
npm run seo

# Complete development setup (one command)
npm run dev:setup

# Generate social images (requires Puppeteer)
npm run generate-social-image

# Generate chatbot content for RAG
npm run chatbot:content
```

### Development Workflow
1. Write blog posts as markdown in `app/blog/posts/markdown/`
2. Add proper frontmatter (see docs/frontmatter-example.md)
3. Run `npm run seo` to generate TSX, tags, and indexes
4. Test locally with `npm run dev`
5. Commit and push - Vercel auto-deploys

---

## Deployment

### Hosting: Vercel
- **Platform**: Vercel (Next.js optimized)
- **URL**: https://cyberworldbuilders.com (production)
- **Preview**: Every PR gets a preview deployment
- **Auto-deploy**: Main branch → production, all branches → preview

### Build Process
```json
// vercel.json
{
  "buildCommand": "npm run lint && npm run build",
  "installCommand": "npm ci"
}
```

### Pre-Deploy Validation
```bash
# Runs automatically in Vercel
npm run predeploy  # Runs: test:ci && lint
```

### Secrets in Vercel
Configure these in Vercel dashboard:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_MAKE_COM_WEBHOOK_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Stripe keys (if needed)

### Docker (Optional)
```bash
# Build image
docker build -t legend .

# Run container
docker-compose up
```

---

## Current Blog Pipeline

### How Blog Posts Are Created

**1. Author writes markdown post**
- Location: `app/blog/posts/markdown/<slug>.md`
- Includes rich frontmatter (title, description, tags, keywords, topics, dates, etc.)
- Standard markdown with GitHub-flavored extensions

**Example frontmatter:**
```yaml
---
title: "The Jumpstarter: A 5-Point Framework to Align Value and Passion"
description: "A productivity framework for daily stand-up reports..."
publishedDate: 2024-01-14
modifiedDate: 2025-09-23
keywords:
  - productivity framework
  - daily stand-up
tags:
  - productivity
  - framework
  - daily-standup
topics:
  - Career & Professional Development
series: "Productivity & Frameworks"
category: "Career"
isDraft: false
isFeatured: false
priority: 8
canonicalUrl: "https://cyberworldbuilders.com/blog/the-jumpstarter..."
language: "en-US"
---
```

**2. Scripts generate TSX components**
```bash
npm run generate-tsx-posts
```
- Converts markdown → TSX in `app/blog/posts/generated/<slug>.tsx`
- Embeds frontmatter as metadata
- Creates importable React components

**3. Post index and tags are updated**
```bash
npm run generate-post-index  # Creates lib/post-index.json
npm run generate-tag-json    # Creates lib/tag-pages-index.json
npm run generate-tag-pages   # Creates tag page components
```

**4. SEO validation and reporting**
```bash
npm run seo:report           # Generates seo-report.json
npm run validate-tags        # Checks tag consistency
```

**5. Social images (manual)**
```bash
npm run generate-social-image  # Uses Puppeteer to create OG images
```

### How Blog Posts Are Rendered

**App Router flow:**
1. User visits `/blog/[slug]`
2. `app/blog/[slug]/page.tsx` handles routing
3. Dynamically imports TSX component from `app/blog/posts/generated/`
4. Renders with `<Article>` wrapper component
5. Adds structured data, social share, related posts

**Post discovery:**
- Posts indexed in `lib/post-index.json`
- Blog listing reads this index
- Tags managed via `lib/tag-pages-index.json`

### Current Limitations
- **Manual process**: Author must run scripts after writing
- **No CMS**: Direct file editing required
- **No versioning**: No draft/publish workflow beyond `isDraft` flag
- **No collaboration**: Single-author model
- **Social images manual**: No automated generation

---

## Current Lead Capture

### What Exists Now
- **Email link**: `contact@cyberworldbuilders.com` on homepage
- **No forms**: No contact forms, no newsletter signup, no CTAs
- **No database**: No lead storage beyond email inbox
- **No automation**: No follow-up sequences, no tagging, no scoring
- **No analytics**: No tracking of lead sources or conversions

### What's Missing (Lead Generation Gaps)
1. **Contact forms**: No way to capture structured lead info
2. **CTAs**: No clear calls-to-action on blog posts
3. **Lead magnets**: No downloadable resources to exchange for emails
4. **Email capture**: No newsletter or content subscription
5. **Lead routing**: No automated notification to sales/founder
6. **Lead enrichment**: No automatic data enhancement
7. **Lead scoring**: No qualification or prioritization
8. **Follow-up**: No automated nurture sequences
9. **Analytics**: No conversion tracking or attribution

### Integration Points (Planned)
- **Make.com webhook** (env var configured, not used)
- **Supabase** (env var configured, not set up)
- **Stripe** (integrated but unused)

---

## Planned Automation Project: Lead Funnel + Content Pipeline with n8n

### Project Goals

**Primary objectives:**
1. Build basic n8n fluency through practical use (not mastery)
2. Create demo-able online portfolio piece to attract attention
3. Add real business value to cyberworldbuilders.com NOW

**Success Criteria:**
- [ ] Working lead capture form on website
- [ ] Leads stored in database with audit trail
- [ ] Automated email follow-up (1-3 emails)
- [ ] Lead scoring and tagging based on behavior
- [ ] Notifications to founder for high-value leads
- [ ] Voice memo → blog post pipeline working end-to-end
- [ ] At least 1 blog post published from voice memo
- [ ] n8n workflows deployed and monitored
- [ ] Demo video showing both workflows
- [ ] Public case study/blog post about the implementation

### Use Cases

#### Use Case 1: Lead Capture & Nurturing Funnel

**User Journey:**
1. Visitor reads blog post, sees CTA ("Want to work together?")
2. Clicks CTA → modal/page with contact form
3. Fills out: name, email, company, project type, budget, message
4. Submits form → data sent to n8n webhook
5. n8n workflow:
   - Validates data
   - Checks for duplicates (dedupe)
   - Enriches lead (company info, LinkedIn, etc.)
   - Scores lead (budget + project type + urgency)
   - Stores in Supabase `leads` table
   - Logs event to `lead_events` table
   - Sends notification email to founder if score > threshold
   - Triggers email sequence (day 0, day 3, day 7)
   - Updates CRM tags

**Lead Scoring Logic:**
- Budget tier: <$5k (1), $5k-$20k (3), $20k-$50k (5), $50k+ (10)
- Project type: Consultation (2), MVP/SaaS (5), Enterprise (8)
- Urgency: ASAP (5), This month (3), Exploring (1)
- Source: Blog reader (2), Direct link (1), Referral (5)

**Email Sequence:**
- **Day 0**: Thank you + what to expect + link to calendar
- **Day 3**: Case study relevant to their project type + CTA
- **Day 7**: FAQ + "Still interested?" + calendar link

#### Use Case 2: Blog/Content Automation

**User Journey (Content Creator - Jay):**
1. Jay records voice memo while driving (iPhone Voice Memos)
2. Saves to iCloud or uploads to Dropbox/Google Drive
3. n8n workflow triggers on new file:
   - Downloads audio file
   - Transcribes via OpenAI Whisper API
   - Sends transcript to GPT-4 for refinement:
     - Fix grammar and filler words
     - Structure into sections (intro, body, conclusion)
     - Extract key points and quotes
     - Suggest title, description, tags
     - Format as markdown with proper frontmatter
   - Saves refined markdown to `app/blog/posts/markdown/`
   - Creates PR in GitHub with new post
   - Sends preview link + Slack/email notification
4. Jay reviews PR, makes edits, approves
5. Merge → auto-deploy to Vercel
6. Post-deploy: run SEO scripts, generate social image, tweet link

**LLM Content Refinement Prompt:**
```
You are a technical blog editor for CyberWorld Builders.

Transform this voice memo transcript into a polished blog post:

1. Fix grammar, remove filler words ("um", "like", "you know")
2. Structure into clear sections with markdown headings
3. Extract key insights and quotable phrases
4. Maintain conversational, authentic tone (Jay's voice)
5. Add code examples if technical topics mentioned
6. Suggest SEO-friendly title (under 60 chars)
7. Write compelling meta description (under 160 chars)
8. Suggest 5-10 relevant tags (from existing taxonomy)
9. Identify 2-3 topic categories
10. Format with proper frontmatter

Transcript:
[transcript here]

Output format: Complete markdown file with frontmatter
```

### Implementation Plan: Smallest Shippable Slice

**Phase 1: Lead Capture MVP (Week 1)**
- [ ] Create simple contact form component
- [ ] Add CTA to blog post template
- [ ] Set up n8n workflow with webhook trigger
- [ ] Create Supabase tables: `leads`, `lead_events`
- [ ] Store leads in database (no enrichment yet)
- [ ] Send notification email to founder
- [ ] Deploy and test

**Phase 2: Lead Nurturing (Week 2)**
- [ ] Add lead scoring logic
- [ ] Implement deduplication check
- [ ] Set up email sending (Resend/SendGrid)
- [ ] Create 3-email sequence
- [ ] Add tagging system
- [ ] Deploy and test with real leads

**Phase 3: Content Pipeline MVP (Week 3)**
- [ ] Set up file upload trigger (Dropbox/iCloud)
- [ ] Integrate OpenAI Whisper for transcription
- [ ] Create GPT-4 refinement prompt
- [ ] Generate markdown with frontmatter
- [ ] Save to markdown folder (local or via GitHub API)
- [ ] Test with 1 voice memo

**Phase 4: Content Pipeline Automation (Week 4)**
- [ ] Automate GitHub PR creation
- [ ] Add Slack/email notification
- [ ] Auto-run SEO scripts post-merge (GitHub Action)
- [ ] Generate social images automatically
- [ ] Test full pipeline end-to-end
- [ ] Document workflow

**Phase 5: Monitoring & Iteration (Ongoing)**
- [ ] Set up n8n error monitoring
- [ ] Add retry logic for failed steps
- [ ] Create dashboard for lead metrics
- [ ] Add A/B testing for email subject lines
- [ ] Optimize LLM prompts based on output quality
- [ ] Create demo video
- [ ] Write case study blog post

### Integration Points in Codebase

**Where to add lead capture form:**
1. Create `components/ContactForm.tsx`
   - Form fields: name, email, company, projectType, budget, urgency, message
   - Client-side validation with Zod or native HTML5
   - Cloudflare Turnstile or reCAPTCHA for spam protection
   - Submit to `/api/leads/submit` API route

2. Create `app/api/leads/submit/route.ts`
   - Receives form data
   - Validates and sanitizes
   - Sends to n8n webhook (env var: `NEXT_PUBLIC_N8N_WEBHOOK_URL`)
   - Returns success/error response

3. Add CTA to blog posts
   - Insert `<ContactCTA />` component at end of each post
   - Show after X% of post read (scroll depth)
   - A/B test different CTA copy

**Where to add voice memo integration:**
- n8n runs outside codebase (cloud or self-hosted)
- n8n workflow uses GitHub API to create PR with markdown file
- GitHub Action (`.github/workflows/post-publish.yml`) triggers on merge to `main`:
  ```yaml
  - Run npm run seo
  - Commit generated files
  - Deploy to Vercel (automatic)
  ```

### Data Model Recommendations

**Supabase Tables:**

```sql
-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,

  -- Project details
  project_type TEXT, -- 'consultation' | 'mvp' | 'saas' | 'enterprise'
  budget_tier TEXT,  -- '<5k' | '5k-20k' | '20k-50k' | '50k+'
  urgency TEXT,      -- 'asap' | 'this-month' | 'exploring'
  message TEXT,

  -- Scoring & status
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  tags TEXT[], -- ['hot-lead', 'saas-project', 'east-coast']

  -- Attribution
  source TEXT,       -- 'blog-post' | 'homepage' | 'referral'
  source_url TEXT,   -- Full URL where form was submitted
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Enrichment (added by n8n)
  linkedin_url TEXT,
  company_size TEXT,
  company_industry TEXT,
  enriched_at TIMESTAMP,

  -- Privacy
  consent_marketing BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT
);

-- Lead events table (audit trail)
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),

  event_type TEXT NOT NULL, -- 'form_submit' | 'email_sent' | 'email_opened' | 'email_clicked' | 'score_updated' | 'status_changed'
  event_data JSONB,          -- Flexible data for each event type

  -- Idempotency
  idempotency_key TEXT UNIQUE, -- Prevent duplicate events

  -- Attribution
  triggered_by TEXT          -- 'n8n-workflow' | 'manual' | 'api'
);

-- Blog content table (for voice memo pipeline)
CREATE TABLE blog_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Source
  audio_file_url TEXT,
  audio_duration_seconds INTEGER,

  -- Processing
  transcript_raw TEXT,
  transcript_refined TEXT,
  markdown_output TEXT,

  -- Metadata
  status TEXT DEFAULT 'processing', -- 'processing' | 'draft' | 'review' | 'published' | 'rejected'
  title_suggestion TEXT,
  description_suggestion TEXT,
  tags_suggestion TEXT[],

  -- Publishing
  published_slug TEXT,
  published_at TIMESTAMP,
  github_pr_url TEXT,

  -- Workflow tracking
  n8n_execution_id TEXT,
  error_log TEXT
);
```

**Indexes:**
```sql
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX idx_lead_events_idempotency ON lead_events(idempotency_key);
CREATE INDEX idx_blog_drafts_status ON blog_drafts(status);
```

### Safety Practices & Governance

**1. Idempotency**
- Every n8n webhook includes `idempotency_key` (UUID or hash of request)
- Check `lead_events.idempotency_key` before processing
- If exists, return success without re-processing
- Prevents duplicate emails, duplicate DB writes

**2. Retry Logic**
- n8n built-in retry: 3 attempts with exponential backoff
- Separate "critical" (DB write) from "non-critical" (email) steps
- Critical failures → store in dead letter queue (Supabase table)
- Non-critical failures → log and continue

**3. Dedupe Keys**
- Leads: dedupe on email (check before insert)
- Events: dedupe on idempotency_key (unique constraint)
- Voice memos: dedupe on audio_file_url

**4. Dry-Run Mode**
- Add `?dry_run=true` query param to n8n webhooks
- Logs actions without executing (no DB writes, no emails)
- Used for testing new workflows

**5. Audit Logging**
- Every lead action → `lead_events` entry
- Store: timestamp, event type, triggering workflow, data payload
- Enables replay, debugging, compliance

**6. Error Handling**
- Try/catch in n8n nodes
- Errors logged to Supabase `workflow_errors` table
- Slack/email alerts for critical failures
- Graceful degradation (e.g., skip enrichment if API down)

**7. PII Handling**
- Encrypt sensitive fields (`email`, `message`) at rest (Supabase encryption)
- GDPR compliance: add `gdpr_delete_requested` flag
- Data retention policy: auto-delete leads after 2 years if no activity
- No PII in logs (redact in n8n logging)

**8. Rate Limiting**
- Webhook rate limit: 10 req/min per IP (Cloudflare or n8n)
- Email sending: max 5/day per lead
- API calls: respect vendor limits (OpenAI, Clearbit, etc.)

**9. Testing**
- Unit tests for API routes (`__tests__/api/leads/submit.test.ts`)
- Integration tests for n8n workflows (Postman/cURL)
- Staging environment (separate n8n instance, separate Supabase project)

**10. Monitoring**
- n8n execution history (built-in)
- Sentry for error tracking
- Daily digest: # leads, # emails sent, # errors
- Uptime monitoring for n8n webhooks (UptimeRobot)

---

## Agent Instructions

### How to Make Changes Safely

**1. Code Conventions**
- **TypeScript**: Use strict typing, no `any` unless absolutely necessary
- **Components**: Functional components with TypeScript interfaces
- **File naming**: PascalCase for components, kebab-case for utilities
- **Imports**: Use `@/` alias for root imports (e.g., `@/lib/content-utils`)
- **Styles**: Tailwind utility classes, avoid custom CSS unless required

**2. Type Safety**
- Always define interfaces for props and return types
- Use `Record<string, unknown>` for dynamic objects
- Export types from component files for reuse

**3. Testing**
- Add tests for new API routes in `__tests__/`
- Run `npm test` before committing
- Ensure `npm run test:ci` passes (required for deploy)

**4. Linting & Formatting**
- Run `npm run lint` before committing
- Fix ESLint errors (not warnings, unless specified)
- Follow Next.js conventions (use `<Link>` not `<a>`, `<Image>` not `<img>`)

**5. Content Changes**
- Edit markdown in `app/blog/posts/markdown/`
- Run `npm run seo` to regenerate TSX, tags, indexes
- Validate frontmatter format (see `docs/frontmatter-example.md`)
- Test post locally before committing

**6. Database Migrations**
- Use Supabase migrations (not manual SQL)
- Add migration file with timestamp: `20250128_create_leads_table.sql`
- Test in local Supabase instance first
- Document breaking changes in commit message

**7. Git Workflow**
- Branch naming: `feature/lead-capture-form`, `fix/chat-widget-bug`
- Commit messages: Conventional Commits format
  - `feat: add contact form component`
  - `fix: resolve chat widget API error`
  - `docs: update CLAUDE.md with n8n integration`
- Always pull before pushing
- Squash commits before merging to main

### Where to Add New Code

**API Routes**
- Location: `app/api/<resource>/route.ts`
- Example: `app/api/leads/submit/route.ts`
- Always export `POST`, `GET`, etc. as named exports
- Use Next.js `NextResponse` for responses

**Components**
- Location: `components/<ComponentName>.tsx`
- Export default component
- Include TypeScript interface for props
- Add JSDoc comments for complex components

**Utilities**
- Location: `lib/<utility-name>.ts`
- Pure functions, no side effects
- Export individual functions, not default
- Add unit tests in `__tests__/lib/`

**Hooks**
- Location: `lib/hooks/<useSomething>.ts`
- Follow React hooks rules
- Prefix with `use`

**Scripts**
- Location: `scripts/<script-name>.js`
- Add to `package.json` scripts
- Include error handling and logging
- Document usage in comments

**Environment Variables**
- Add to `.example.env` with placeholder value
- Add to `README.md` if critical
- Use `NEXT_PUBLIC_` prefix for client-side vars
- Never commit actual values

### How to Work with Claude Code Agents

**Prompting Best Practices**

1. **Be specific about scope**
   - Good: "Add a contact form to the homepage that sends data to /api/leads/submit"
   - Bad: "Add lead capture"

2. **Reference actual file paths**
   - Good: "Edit app/page.tsx to add the ContactForm component"
   - Bad: "Update the homepage"

3. **Specify success criteria**
   - Good: "The form should validate email format, show error messages, and disable submit button while submitting"
   - Bad: "Make the form work"

4. **Break complex tasks into steps**
   - Good: "First create the ContactForm component with basic fields. Then add validation. Then wire up the API route."
   - Bad: "Build the entire lead capture system"

5. **Include context about integrations**
   - Good: "The API route should send data to n8n webhook at NEXT_PUBLIC_N8N_WEBHOOK_URL. Include idempotency key in headers."
   - Bad: "Send the data somewhere"

6. **Mention files to preserve**
   - Good: "Keep the existing ChatWidget in place, add the contact form below it"
   - Bad: "Add a contact form" (might remove existing components)

7. **Specify testing requirements**
   - Good: "Add a Jest test that verifies the API route returns 400 if email is missing"
   - Bad: "Add tests"

**Example Agent Tasks**

```plaintext
Task: Add contact form to homepage

Steps:
1. Create components/ContactForm.tsx with fields: name (text), email (email), company (text), projectType (select), budget (select), message (textarea)
2. Add client-side validation: email format, required fields
3. Add Cloudflare Turnstile widget (use NEXT_PUBLIC_TURNSTILE_SITE_KEY env var)
4. On submit, POST to /api/leads/submit
5. Show success message or error message
6. Add loading state during submission

Requirements:
- Use Tailwind CSS matching the existing green-on-black theme
- TypeScript with proper interfaces
- Disable submit button while loading
- Clear form after successful submission
```

```plaintext
Task: Create lead submission API route

Steps:
1. Create app/api/leads/submit/route.ts
2. Validate request body (name, email required)
3. Generate idempotency key (hash of email + timestamp)
4. Send to n8n webhook at process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
5. Include headers: X-Idempotency-Key, X-Source-Url
6. Return success (200) or error (400/500)

Requirements:
- TypeScript with proper types
- Error handling for fetch failures
- Log errors to console
- Add JSDoc comments
```

```plaintext
Task: Update blog post template to include contact CTA

Steps:
1. Create components/ContactCTA.tsx with heading, description, and button
2. Button opens ContactForm in modal (or links to /contact page)
3. Edit app/blog/[slug]/page.tsx to include ContactCTA at bottom
4. Match existing Tailwind theme

Requirements:
- Responsive design
- Accessible (ARIA labels)
- Matches terminal aesthetic
```

### Common Pitfalls to Avoid

1. **Don't edit generated files directly**
   - Files in `lib/generated-*` and `app/blog/posts/generated/` are auto-generated
   - Edit the scripts or markdown source instead

2. **Don't skip the content pipeline**
   - Always run `npm run seo` after editing markdown
   - Otherwise, post index and tags will be stale

3. **Don't hardcode URLs**
   - Use env vars for external URLs (webhooks, APIs)
   - Use Next.js `<Link>` for internal navigation

4. **Don't commit secrets**
   - Use `.env.local` (gitignored) for local secrets
   - Use Vercel env vars for production secrets

5. **Don't skip testing**
   - Run `npm run test:ci` before pushing
   - Vercel will reject builds that fail tests

6. **Don't break the build**
   - Run `npm run build` locally before pushing
   - Check for TypeScript errors

7. **Don't introduce dependencies without asking**
   - Consult before adding new npm packages
   - Prefer built-in solutions or existing dependencies

---

## Next Steps for Agents

When starting work on this repository, agents should:

1. **Read this file first** - Understand project structure and conventions
2. **Check package.json** - Review available scripts
3. **Check .env.example** - Understand required environment variables
4. **Run `npm run dev:setup`** - Generate all content pipelines
5. **Explore key files**:
   - `app/page.tsx` - Homepage
   - `app/blog/[slug]/page.tsx` - Blog post rendering
   - `components/ChatWidget.tsx` - Chat interface
   - `lib/post-metadata.ts` - Content utilities
6. **Review docs/** - Check existing documentation for patterns

---

## Questions & Support

- **Primary maintainer**: Jay Long (contact@cyberworldbuilders.com)
- **Repository**: Check GitHub issues for known bugs or feature requests
- **Deployment**: Vercel dashboard for production logs and analytics
- **Documentation**: See `docs/` for troubleshooting guides

---

## Revision History

- **2026-01-28**: Initial CLAUDE.md created with comprehensive project overview, planned n8n automation, and agent instructions
