### Planning Strategy for n8n to Interact with Supabase Data via Next.js Admin Console

Your setup involves a Next.js app on Vercel acting as the frontend/admin console for managing Supabase tables, with n8n (and its custom nodes) needing to read/write data from those tables. This is a common pattern for automation workflows, like the transcript cleanup you mentioned earlier. The key challenges are security (avoid exposing sensitive data), performance (minimize latency), and maintainability (avoid duplicating logic between Next.js and n8n).

Based on best practices from Supabase, n8n, Next.js, and Vercel, I'll outline the options, pros/cons, and recommend a hybrid approach. The goal is to enable n8n to perform CRUD operations (e.g., fetch unprocessed transcripts, update them) while leveraging your existing Next.js logic where possible.

#### Key Considerations
- **Security**: Use authentication to prevent unauthorized access. Supabase has Row Level Security (RLS) for DB-level control. For external access (n8n), prefer API keys or JWT over direct DB exposure.
- **Performance**: Vercel and Supabase Edge Functions are serverless and edge-deployed, so they're fast and scalable. Direct DB access from n8n is simplest but could introduce latency if n8n is local.
- **Integration with Next.js**: If your admin console has custom business logic (e.g., validation, transformations), you don't want to replicate it in n8n or Edge Functions.
- **n8n Capabilities**: n8n has a built-in Supabase node for CRUD (Create, Delete, Get, Get Many, Update). It supports credentials like Supabase URL and keys. Custom nodes can use HTTP requests for APIs.
- **Cost**: All options are free-tier friendly (Supabase allows 500k Edge Function invocations/month; Vercel has generous API limits).
- **Development Workflow**: Use environment variables for secrets (e.g., in n8n creds, Vercel env vars). Test locally with Supabase CLI or Vercel previews.

#### Option 1: Direct Access to Supabase from n8n (No Next.js Involvement)
Use n8n's built-in Supabase node to query tables directly.

- **How to Implement**:
  1. In Supabase Dashboard: Enable RLS on your tables (e.g., `transcripts`). Define policies like "Allow read if `is_processed = false`" or based on a specific user/role.
  2. Create a dedicated Supabase user/role with limited permissions (e.g., read/write only on specific tables/columns). Avoid the full `service_role` key (it bypasses RLS—use it only for admin tasks).
  3. In n8n: Go to Credentials > Add "Supabase" > Enter your Supabase URL (e.g., `https://your-project.supabase.co`), anon key (for public access) or service key (with caution), and database details.
  4. In your workflow/custom node: Use the Supabase node for operations (e.g., "Get Many" with filter `is_processed = false`, then update with "Update").
- **Pros**: Simplest—no extra code. Fast for basic CRUD. n8n handles batching/loops (e.g., "Loop Over Items" for processing multiple rows).
- **Cons**: Bypasses any Next.js-specific logic (e.g., if admin console does custom validation). Less secure if RLS isn't airtight; n8n has direct DB access.
- **When to Use**: If data interactions are straightforward (e.g., just fetch/update transcripts) and don't need Next.js middleware.

#### Option 2: Create API Endpoints in Next.js with JWT/API Key Auth (Proxy Through Vercel)
Expose endpoints in Next.js that handle Supabase queries, and have n8n call them via HTTP.

- **How to Implement**:
  1. In Next.js: Add API routes (e.g., `/api/transcripts/unprocessed`) in `pages/api` or `app/api` (Route Handlers in App Router). Use Supabase JS client to query DB.
     - Example (App Router):
       ```ts
       // app/api/transcripts/unprocessed/route.ts
       import { createClient } from '@supabase/supabase-js';
       import { NextResponse } from 'next/server';

       export async function GET(request: Request) {
         const authHeader = request.headers.get('authorization');
         if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
         }
         const token = authHeader.split(' ')[1];
         // Validate JWT (use jose lib for self-contained JWT validation—no caching needed on Vercel)
         // Or check against a hardcoded API key from env vars
         const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
         const { data, error } = await supabase.from('transcripts').select('*').eq('is_processed', false);
         if (error) return NextResponse.json({ error }, { status: 500 });
         return NextResponse.json(data);
       }
       ```
     - For updates: Use POST/PATCH routes similarly.
  2. **Auth Flow**:
     - **JWT**: Set up a login endpoint in Next.js (or use Supabase Auth) to issue JWTs. n8n gets a token (e.g., via a "HTTP Request" node to `/api/auth/login` with credentials), then uses it in subsequent calls (Bearer token in headers).
     - **API Key (Simpler for Machine-to-Machine)**: Hardcode a key in Vercel env vars (e.g., `INTERNAL_API_KEY`). n8n passes it in headers or query params. Validate in the route.
     - Best Practice: Use HTTP-only cookies if possible, but for external n8n, JWT/API keys are standard. Validate JWTs with libraries like `jose` for serverless compatibility.
  3. Deploy to Vercel: API routes auto-deploy as serverless functions.
  4. In n8n: Use "HTTP Request" node (or custom node) to call your endpoints. Store auth (key/JWT) in credentials.
- **Pros**: Full control—add Next.js logic (e.g., validation, logging). Secure for external access. Vercel handles scaling.
- **Cons**: Extra network hop (n8n → Vercel → Supabase). Potential cold starts on Vercel (minimal with Edge Functions).
- **When to Use**: If you need to reuse admin console logic or centralize access.

#### Option 3: Use Supabase Edge Functions (Bypass Next.js for Simple Ops)
Deploy serverless functions in Supabase for DB interactions, invoked by n8n.

- **How to Implement**:
  1. In Supabase: Use CLI (`supabase functions new my-function`) or Dashboard to create TS functions (Deno runtime).
     - Example: Function to fetch unprocessed transcripts.
       ```ts
       // supabase/functions/get-unprocessed.ts
       import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
       import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

       serve(async (req) => {
         const authHeader = req.headers.get('Authorization');
         if (!authHeader) return new Response('Unauthorized', { status: 401 });
         // Validate API key or Supabase JWT
         const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
         const { data, error } = await supabase.from('transcripts').select('*').eq('is_processed', false);
         if (error) return new Response(JSON.stringify(error), { status: 500 });
         return new Response(JSON.stringify(data), { status: 200 });
       });
       ```
     - Deploy: `supabase functions deploy my-function`.
  2. **Auth**: Use Supabase JWT (from Auth) or a secret key (stored in Supabase Vault). n8n authenticates via headers.
  3. Invoke from n8n: Use "HTTP Request" node to call `https://your-project.supabase.co/functions/v1/my-function` with auth.
- **Pros**: Low latency (edge-deployed, close to DB). Integrates natively with Supabase Auth/DB. Great for webhooks/automation.
- **Cons**: Duplicates code if overlapping with Next.js. Limited to short tasks (timeout ~150s on free tier).
- **When to Use**: For DB-heavy ops without Next.js logic (e.g., simple fetches/updates).

#### Recommended Strategy: Combination of Direct Supabase + Next.js APIs
- **Primary**: Use **direct Supabase access from n8n** for simple reads/writes (e.g., fetch unprocessed, update cleaned transcripts). Secure with RLS and a dedicated limited user/key. This leverages n8n's Supabase node out-of-the-box.
- **Fallback/Complex**: For ops needing Next.js logic (e.g., admin validations, multi-step processes), create **API endpoints in Next.js** secured with **API keys** (easier than JWT for n8n). n8n calls them via HTTP.
- **Avoid Edge Functions Initially**: Use them only if you need webhooks (e.g., Supabase DB triggers calling n8n) or if direct access proves slow. They're overkill for basic CRUD but great for scaling integrations.
- **Why This Hybrid?** Balances simplicity (direct for 80% of cases) with control (APIs for the rest). Aligns with best practices: n8n docs emphasize secure creds; Supabase pushes RLS; Next.js/Vercel favors API routes for external security.

#### Next Steps
1. Audit your tables: Enable RLS in Supabase.
2. Test Direct: Set up Supabase creds in n8n, build a sample workflow.
3. Add APIs if Needed: Start with one endpoint (e.g., `/api/transcripts`), secure with API key.
4. Monitor: Use Supabase logs for access, Vercel for API metrics.
5. Secrets: Store keys in n8n creds, Vercel env, never commit.

If your data has specific sensitivity or logic needs, share more details for tweaks!

---

## Implemented: Get Next Unprocessed Transcript (Automation API)

The recommended approach for the **Get Next Unprocessed Transcript** custom node is the **Next.js automation API with API key** (Option 2 above). This avoids storing Supabase credentials in n8n and keeps "next unprocessed" logic in one place.

### Endpoint

- **URL:** `GET /api/automation/transcripts/next-unprocessed`
- **Auth:** API key via header `X-API-Key` or `Authorization: Bearer <key>`.
- **Env:** Set `CYBERWORLD_AUTOMATION_API_KEY` in the Next.js app (e.g. in `.env.local` or Vercel). See [.example.env](.example.env) in the project root.
- **Response:** `200` with `{ "transcript": <object> }` (one row) or `{ "transcript": null }` when none. `401` if the API key is missing or invalid.

Use the same value for `CYBERWORLD_AUTOMATION_API_KEY` in the app and for the **API Key** field in the n8n **CyberWorld API** credential so the custom node can authenticate.