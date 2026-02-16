/**
 * Rate limiting for anonymous endpoints (e.g. /api/track).
 * Uses Upstash Redis when configured; otherwise passes through.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  const redis = new Redis({ url: redisUrl, token: redisToken });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  });
}

export async function checkRateLimit(identifier: string): Promise<{ ok: boolean; remaining?: number }> {
  if (!ratelimit) {
    return { ok: true };
  }

  const { success, remaining } = await ratelimit.limit(identifier);
  return { ok: success, remaining };
}

export function isRateLimitConfigured(): boolean {
  return Boolean(redisUrl && redisToken);
}
