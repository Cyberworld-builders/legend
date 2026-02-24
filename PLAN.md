# AI Usage Dashboard Implementation Plan

## Overview
Add a unified dashboard to the admin section of cyberworldbuilders.com for tracking AI token usage and spend across XAI, Claude, GPT, and Cursor. This will help monitor budgets, optimize model usage, and inform decisions on switching models for tasks.

## Repo Analysis
- Stack: Next.js (app router), likely with Vercel deployment.
- Key Files/Dirs: app/ for pages/routes, components/ for UI, possible api/ for backend routes.
- Assumptions: Admin dashboard exists (e.g., /admin route); auth in place (e.g., NextAuth).

## Features
- Unified view: Tokens used, costs, remaining budget per provider.
- Charts: Usage over time (e.g., via Chart.js).
- Alerts: Threshold warnings (e.g., 80% budget used).
- Suggestions: Model switch recommendations based on task/cost.
- Secure: API keys in env vars, server-side fetching.

## Implementation Steps
1. **Backend API:**
   - New route: /api/ai-usage (GET fetches data from providers).
   - Integrations: Use provider SDKs (e.g., openai npm for GPT).
   - Env Vars: Add XAI_API_KEY, CLAUDE_API_KEY, etc. to Vercel.

2. **Frontend:**
   - New page/component: app/admin/ai-usage/page.tsx.
   - UI: Table + charts, refresh button.
   - Fetch from API route.

3. **Testing:**
   - Local: npm run dev, mock data.
   - Deploy: Vercel preview.

4. **Next Steps**
   - Await Claude access for coding.
   - PR updates with code.

(Plan drafted by Gus)