/**
 * Server-side validation for Cloudflare Turnstile tokens.
 * When TURNSTILE_SECRET_KEY is not configured, validation passes (graceful degradation).
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function validateTurnstileToken(
  token: string | null | undefined,
  remoteip?: string | null
): Promise<{ valid: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { valid: true };
  }

  if (!token || typeof token !== 'string' || token.length === 0) {
    return { valid: false, error: 'Verification token required' };
  }

  if (token.length > 2048) {
    return { valid: false, error: 'Invalid token' };
  }

  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  if (remoteip) {
    formData.append('remoteip', remoteip);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      signal: AbortSignal.timeout(10000),
    });

    const result = (await response.json()) as TurnstileResponse;

    if (!result.success) {
      const codes = result['error-codes']?.join(', ') ?? 'unknown';
      return { valid: false, error: `Verification failed: ${codes}` };
    }

    return { valid: true };
  } catch (err) {
    console.error('Turnstile validation error:', err);
    return { valid: false, error: 'Verification service unavailable' };
  }
}
