/**
 * Lightweight A/B testing utility.
 *
 * - Deterministic 50/50 assignment stored in localStorage.
 * - Controlled via env vars:
 *   NEXT_PUBLIC_AB_TEST_ENABLED  – set to "false" to disable (always variant A)
 *   NEXT_PUBLIC_AB_TEST_FORCE_VARIANT – force "A" or "B" for testing
 */

export interface ExperimentResult {
  experimentId: string;
  variant: 'A' | 'B';
}

export function getVariant(experimentId: string): ExperimentResult {
  // Server-side or disabled → always A
  if (typeof window === 'undefined') {
    return { experimentId, variant: 'A' };
  }

  const enabled = process.env.NEXT_PUBLIC_AB_TEST_ENABLED;
  if (enabled === 'false') {
    return { experimentId, variant: 'A' };
  }

  const forced = process.env.NEXT_PUBLIC_AB_TEST_FORCE_VARIANT;
  if (forced === 'A' || forced === 'B') {
    return { experimentId, variant: forced };
  }

  const storageKey = `ab_${experimentId}`;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'A' || stored === 'B') {
      return { experimentId, variant: stored };
    }

    const variant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(storageKey, variant);
    return { experimentId, variant };
  } catch {
    // localStorage blocked (private browsing, etc.)
    return { experimentId, variant: 'A' };
  }
}
