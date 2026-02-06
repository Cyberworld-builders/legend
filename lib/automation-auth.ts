import { NextResponse } from 'next/server';

const ENV_KEY = 'CYBERWORLD_AUTOMATION_API_KEY';

/**
 * Validates the request using the automation API key.
 * Accepts X-API-Key header or Authorization: Bearer <key>.
 * Returns null if valid; returns a NextResponse (401) if invalid or missing key.
 */
export function validateAutomationApiKey(request: Request): NextResponse | null {
  // #region agent log
  const hasXApiKey = !!request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const hasBearer = !!(authHeader?.startsWith('Bearer '));
  fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'automation-auth.ts:validateAutomationApiKey',message:'auth check entry',data:{hasXApiKey,hasBearer},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const expected = process.env[ENV_KEY];
  if (!expected || expected.trim() === '') {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'automation-auth.ts:envMissing',message:'returning 500 env key not configured',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    return NextResponse.json(
      {
        error: 'Automation API key is not configured on the server. Set CYBERWORLD_AUTOMATION_API_KEY in .env.local (or your environment) and restart the app.',
      },
      { status: 500 }
    );
  }

  const apiKeyHeader = request.headers.get('x-api-key');
  const token =
    apiKeyHeader ??
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null);

  if (!token || token !== expected) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'automation-auth.ts:unauthorized',message:'returning 401 invalid or missing key',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing API key' },
      { status: 401 }
    );
  }

  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'automation-auth.ts:valid',message:'auth passed',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  return null;
}
