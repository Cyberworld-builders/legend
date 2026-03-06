import { NextResponse } from 'next/server';

const ENV_KEY = 'CYBERWORLD_AUTOMATION_API_KEY';

/**
 * Validates the request using the automation API key.
 * Accepts X-API-Key header or Authorization: Bearer <key>.
 * Returns null if valid; returns a NextResponse (401/500) if invalid or missing key.
 */
export function validateAutomationApiKey(request: Request): NextResponse | null {
  const expected = process.env[ENV_KEY];
  if (!expected || expected.trim() === '') {
    return NextResponse.json(
      {
        error: 'Automation API key is not configured on the server. Set CYBERWORLD_AUTOMATION_API_KEY in .env.local (or your environment) and restart the app.',
      },
      { status: 500 }
    );
  }

  const apiKeyHeader = request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const token =
    apiKeyHeader ??
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null);

  if (!token || token !== expected) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing API key' },
      { status: 401 }
    );
  }

  return null;
}
