# n8n Custom Nodes & Workflow Configs

This directory contains custom n8n nodes and workflow configurations for CyberWorld Builders.

## Directory Structure

```
n8n/
├── README.md                          # This file
└── n8n-nodes-cyberworld/             # Custom n8n community node package
    ├── package.json                   # Node package definition
    ├── tsconfig.json                  # TypeScript config
    ├── index.ts                       # Entry point
    ├── credentials/
    │   ├── CyberWorldApi.credentials.ts  # Site API credential
    │   └── OpenAiApi.credentials.ts      # OpenAI API key (for Cleanup Agent)
    └── nodes/
        ├── CyberWorldTest/
        │   ├── CyberWorldTest.node.ts
        │   └── CyberWorldTest.node.json
        ├── GetNextUnprocessedTranscript/
        │   ├── GetNextUnprocessedTranscript.node.ts
        │   └── GetNextUnprocessedTranscript.node.json
        └── TranscriptCleanupAgent/
            ├── TranscriptCleanupAgent.node.ts
            └── TranscriptCleanupAgent.node.json
```

## Custom Nodes

### CyberWorldTest Node

A test node with two operations:

- **Echo**: Takes text input and returns it with metadata (timestamp, node name)
- **Health Check**: Calls the CyberWorld website `/api/health` endpoint and returns the status

### Prerequisites

- Node.js 18+
- n8n installed locally or running via Docker (see `docker-compose.n8n.yml` at project root)

### Build the Node

```bash
cd n8n/n8n-nodes-cyberworld
npm install
npm run build
```

This compiles TypeScript to the `dist/` directory.

### Install in n8n

#### Option 1: Docker Volume Mount (Recommended for local dev)

Update `docker-compose.n8n.yml` to mount the built node:

```yaml
services:
  n8n:
    # ... existing config ...
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n/n8n-nodes-cyberworld:/home/node/.n8n/custom/node_modules/n8n-nodes-cyberworld
```

Then restart n8n:

```bash
npm run n8n:restart
```

#### Option 2: npm link (for local n8n CLI install)

```bash
cd n8n/n8n-nodes-cyberworld
npm link

# In your n8n installation directory:
npm link n8n-nodes-cyberworld
```

Then restart n8n.

#### Option 3: Copy to custom directory

```bash
# Build first
cd n8n/n8n-nodes-cyberworld
npm install && npm run build

# Copy to n8n custom nodes directory
cp -r . ~/.n8n/custom/node_modules/n8n-nodes-cyberworld/
```

### Using the Node

1. Open n8n (default: http://localhost:5678)
2. Create a new workflow
3. Add a node and search for "CyberWorld Test"
4. Choose an operation:
   - **Echo**: Enter text, execute, see the echoed output
   - **Health Check**: Configure credentials with your site URL, execute to check health

### Transcript Cleanup Agent Node

First of several planned "editor" agents for turning voice-memo transcripts into publishable articles. This node performs **cleanup only**: spelling and grammar from context, preserve voice, optional light formatting (filler, line breaks). No structure or SEO in this node.

- **Input:** Items with `transcript_text` (and optionally `id`, `title`, etc. for pass-through).
- **Output:** Each item gets `cleaned_text` plus all original fields. On error, `cleaned_text` is empty and `cleanup_error` is set.
- **Parameters:** Model (default `gpt-4o-mini`), temperature, max tokens, optional system prompt override.
- **Credentials:** OpenAI API (this package provides "OpenAI API"; add your API key in n8n Credentials).

Use it in a workflow after fetching unprocessed transcripts (e.g. **Get Next Unprocessed Transcript** or Supabase/HTTP) and before updating the transcript record (Supabase or HTTP PATCH).

### Get Next Unprocessed Transcript Node

Polls the Next.js automation API for the next transcript where `is_processed` is false (FIFO by `created_at`). Outputs **one** item (or none) so you can feed the **Transcript Cleanup Agent** without a manual Supabase node or loop.

- **Input:** None required (trigger/poll style).
- **Output:** One item with `id`, `title`, `transcript_text`, `created_at`, `updated_at`, `is_processed`, `created_by`, or zero items when no unprocessed transcript exists.
- **Credentials:** **CyberWorld API** (required). Set **Base URL** to your app (e.g. `http://localhost:3000` or production URL) and **API Key** to the same value as `CYBERWORLD_AUTOMATION_API_KEY` in the app (see `.example.env`).

**Workflow:** Get Next Unprocessed Transcript → Transcript Cleanup Agent → Supabase or HTTP update.

### Configuring Credentials

**CyberWorld API** (for CyberWorld Test and Get Next Unprocessed Transcript):

1. In n8n, go to **Credentials** > **New**
2. Search for "CyberWorld API"
3. Set:
   - **Base URL**: `http://localhost:3000` (or your deployed URL)
   - **API Key**: Required for **Get Next Unprocessed Transcript** (use the same value as `CYBERWORLD_AUTOMATION_API_KEY` in the app). Leave empty only if you use the node just for health check.

**OpenAI API** (for Transcript Cleanup Agent):

1. In n8n, go to **Credentials** > **New**
2. Search for "OpenAI API" (from this package)
3. Set **API Key** to your OpenAI API key (from platform.openai.com). Do not commit secrets.

### Development

Watch mode for development:

```bash
cd n8n/n8n-nodes-cyberworld
npm run dev
```

This runs `tsc --watch` and recompiles on file changes. You'll need to restart n8n to pick up changes.

## Starting n8n Locally

From the project root:

```bash
# Start n8n with Docker
npm run n8n:up

# View logs
npm run n8n:logs

# Stop n8n
npm run n8n:down

# Restart after node changes
npm run n8n:restart
```

n8n will be available at http://localhost:5678 with default credentials from `.env.local`.

---

## Workflow Example: Cleanup Unprocessed Transcripts

A minimal workflow that uses the **Transcript Cleanup Agent**:

1. **Trigger:** Manual (for now). Add a "Manual Trigger" node.
2. **Fetch unprocessed transcripts:** Preferred: add the **Get Next Unprocessed Transcript** node (uses CyberWorld API credential; requires `CYBERWORLD_AUTOMATION_API_KEY` in the app). Alternatively:
   - **Supabase:** Add a Supabase node. Query table `transcripts` with filter `is_processed = false`. Return rows so each item has `id`, `title`, `transcript_text`, etc.
   - **HTTP Request:** Call `GET /api/automation/transcripts/next-unprocessed` with `X-API-Key` header and map the response.
3. **Process each:** Add the **Transcript Cleanup Agent** node. Connect the fetch node to it. The node reads `transcript_text` from each item (and accepts `transcriptText` as an alias). It outputs the same items with `cleaned_text` added and all original fields passed through.
4. **Update record (optional, for later):** To persist the cleaned text and mark as processed, add either:
   - A **Supabase** node that updates the row by `id`: set `transcript_text` to `cleaned_text` and `is_processed` to `true`, or
   - An **HTTP Request** node that PATCHes your API with the updated transcript.

For development you can stop after the Cleanup Agent and inspect output in n8n. Add the update step when moving to polling or automation.

---

## Development Workflow: Managing n8n Automation in Code

**Custom nodes:** Developed in `n8n/n8n-nodes-cyberworld/`. Run `npm run build` to compile; use `npm run dev` for watch. Install into n8n via Docker volume mount (recommended), npm link, or copy into `~/.n8n/custom/node_modules/`. Restart n8n after node changes so it loads the new code.

**Workflow versioning:** Export workflows from n8n (e.g. Export → Download) and commit the JSON under `n8n/workflows/` (or similar) so changes are reviewable and reproducible. When you add or change a custom node type, re-export the workflow after installing the updated node so the JSON references the correct node.

**Credentials and env:** Configure the OpenAI API key (and, if used, Supabase or site API credentials) in n8n's Credentials UI or via n8n environment variables. Do not commit secrets.

---

## First Automation: Cleanup Agent (Instructions)

**Goal:** Run the cleanup agent on unprocessed transcripts with a manual trigger in development.

**Prerequisites:**

- n8n running (e.g. `npm run n8n:up` from project root).
- Custom nodes built and installed (`npm run build` in `n8n/n8n-nodes-cyberworld`, then volume mount or copy as above).
- **OpenAI API** credential configured in n8n with a valid API key.
- Either **Supabase** credentials in n8n (if using the Supabase node to fetch/update) or your deployed API base URL and key (if using HTTP nodes).

**Steps:**

1. Open n8n at http://localhost:5678.
2. Create a new workflow or import one. Build it as in the "Workflow Example" above: Manual Trigger → Fetch unprocessed transcripts → Transcript Cleanup Agent.
3. Configure the **Transcript Cleanup Agent:** Select the OpenAI API credential, choose model (e.g. `gpt-4o-mini`), optionally override the system prompt.
4. Execute manually. Verify input items have `transcript_text` and output items have `cleaned_text` and pass-through fields.
5. Optionally add the "update transcript" step (Supabase or HTTP) and run end-to-end.

**Later:** Polling (e.g. Schedule trigger to fetch unprocessed every N minutes) and exposure to web traffic will be added in a follow-up. This plan is manual trigger only.

---

## Where the Cleanup Agent Fits

This node is the first of several planned "editor" agents in the pipeline: **cleanup** (spelling, light formatting) → **structure/organization** → **strategic SEO** → **voice check** (compare final article to cleaned transcript). For now only the cleanup agent is implemented; the others are planned for later.
