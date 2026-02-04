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
    │   └── CyberWorldApi.credentials.ts  # API credential definition
    └── nodes/
        └── CyberWorldTest/
            ├── CyberWorldTest.node.ts    # Test node implementation
            └── CyberWorldTest.node.json  # Node metadata
```

## CyberWorldTest Node

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

### Configuring Credentials

1. In n8n, go to **Credentials** > **New**
2. Search for "CyberWorld API"
3. Set:
   - **Base URL**: `http://localhost:3000` (or your deployed URL)
   - **API Key**: Leave empty (not required for health check)

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
