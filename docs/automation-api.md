# Automation API — Transcript Processing Pipeline

API endpoints for automated transcript ingestion and blog publishing. Authenticated via `X-API-Key` header (no browser session required).

## Authentication

All endpoints require the `X-API-Key` header:

```
X-API-Key: <CYBERWORLD_AUTOMATION_API_KEY>
```

Alternatively, `Authorization: Bearer <key>` is accepted.

The key is set in:
- **Local:** `.env.local` as `CYBERWORLD_AUTOMATION_API_KEY`
- **Production:** Vercel environment variables (production scope)

> **Note:** When setting the key via Vercel CLI, use `printf` instead of `echo` to avoid a trailing newline:
> ```bash
> printf 'your-key-here' | vercel env add CYBERWORLD_AUTOMATION_API_KEY production
> ```

## Endpoints

### GET /api/automation/transcripts/next-unprocessed

Returns the oldest unprocessed transcript (FIFO).

**Response (200):**
```json
{
  "transcript": {
    "id": "uuid",
    "created_at": "2026-03-06T22:08:56.301Z",
    "updated_at": "2026-03-06T22:08:56.301Z",
    "created_by": "uuid | null",
    "title": "transcript title",
    "transcript_text": "full transcript content",
    "is_processed": false
  }
}
```

**Response when no unprocessed transcripts (200):**
```json
{ "transcript": null }
```

---

### POST /api/automation/transcripts

Creates a new transcript.

**Request body:**
```json
{
  "title": "optional — defaults to NEW_<timestamp>",
  "transcript_text": "required — the transcript content"
}
```

**Response (201):**
```json
{
  "transcript": {
    "id": "uuid",
    "title": "...",
    "transcript_text": "...",
    "is_processed": false,
    "created_at": "...",
    "updated_at": "...",
    "created_by": null
  }
}
```

---

### PATCH /api/automation/transcripts/:id

Updates a transcript. Used to mark as processed and update the title after blog post generation.

**Request body (all fields optional, at least one required):**
```json
{
  "title": "Generated Blog Post Title",
  "transcript_text": "updated text",
  "is_processed": true
}
```

**Response (200):**
```json
{
  "transcript": { "...updated record..." }
}
```

## Pipeline Architecture

```
GusClaw heartbeat (every 30 min)
  |
  +-> GET /api/automation/transcripts/next-unprocessed
  |
  +-> if transcript found:
  |     +-> run editor pipeline (voice-dna + transcript-editor + stop-slop)
  |     +-> generate TSX blog post component
  |     +-> create PR to legend repo (Vercel preview = draft)
  |     +-> PATCH /api/automation/transcripts/:id
  |           { is_processed: true, title: "Generated Title" }
  |
  +-> if transcript is null: sleep until next heartbeat
```

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Invalid JSON or validation failed |
| 401 | Missing or invalid API key |
| 404 | Transcript ID not found (PATCH) |
| 500 | Supabase not configured or query error |

## Blog Index Management

After a new `.tsx` post file is added to `app/blog/posts/`, the blog index must be regenerated so the post appears in listings, sitemaps, and static params.

### Why it's needed

The blog listing page (`/blog`) and slug page (`/blog/[slug]`) both read from `lib/post-index.json` to discover posts. This file is **not auto-generated at build time** — it must be explicitly regenerated whenever a post is added, removed, or has its metadata changed.

### How to regenerate

```bash
npm run generate-post-index
```

This runs `scripts/generate-post-index-new.js`, which:

1. Scans all `.tsx` files in `app/blog/posts/` (excluding `template.tsx`)
2. Extracts the `export const metadata: PostMeta` block from each file using regex
3. Parses string, boolean, number, and array fields from the metadata
4. Sorts posts by `publishedDate` (newest first), then `priority`
5. Writes `lib/post-index.json` with the full index

### When to run it

| Scenario | Run index generation? |
|----------|----------------------|
| New blog post `.tsx` added | Yes |
| Post metadata edited (title, tags, dates, etc.) | Yes |
| Post content changed but metadata unchanged | No |
| Post deleted | Yes |

### Integration with the transcript pipeline

In the automation pipeline (`docs/automation-api.md` pipeline diagram), the index regeneration happens **after** the TSX file is committed and **before** (or as part of) the PR that Vercel will preview-deploy:

```
GusClaw heartbeat
  +-> fetch transcript
  +-> editor pipeline -> generate TSX
  +-> git add app/blog/posts/<slug>.tsx
  +-> npm run generate-post-index          <-- updates lib/post-index.json
  +-> git add lib/post-index.json
  +-> commit + push + create PR
  +-> PATCH transcript as processed
```

If the index is not regenerated, the post file will exist but:
- It won't appear on `/blog`
- `generateStaticParams` won't include it (no SSG page)
- The sitemap won't list it

### Verifying the index

```bash
# Check post count
node -e "console.log(require('./lib/post-index.json').count)"

# Check a specific post is present
node -e "const idx = require('./lib/post-index.json'); console.log(idx.posts.find(p => p.slug === '<slug>') ? 'FOUND' : 'MISSING')"

# Quick smoke test after regenerating
npm run build 2>&1 | grep '/blog/\[slug\]'
```

### Separating responsibilities

If the transcript-to-TSX agent and the blog-index agent are different jobs:

- **Transcript agent**: Generates the `.tsx` file and opens a PR with just the post file.
- **Index agent** (or CI step): Runs `npm run generate-post-index`, commits the updated `lib/post-index.json`, and pushes to the same PR branch.

A GitHub Action can automate this — see `docs/github-workflows.md` for the existing SEO maintenance workflow, which already runs `npm run seo` (an alias for `npm run generate-post-index`).

---

## curl Examples

```bash
# Poll for next unprocessed transcript
curl -H "X-API-Key: $CYBERWORLD_AUTOMATION_API_KEY" \
  https://www.cyberworldbuilders.com/api/automation/transcripts/next-unprocessed

# Create a transcript
curl -X POST \
  -H "X-API-Key: $CYBERWORLD_AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Voice Memo 2026-03-06","transcript_text":"Raw transcript here..."}' \
  https://www.cyberworldbuilders.com/api/automation/transcripts

# Mark as processed
curl -X PATCH \
  -H "X-API-Key: $CYBERWORLD_AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"is_processed":true,"title":"Final Blog Title"}' \
  https://www.cyberworldbuilders.com/api/automation/transcripts/<transcript-id>
```
