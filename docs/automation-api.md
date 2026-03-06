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
