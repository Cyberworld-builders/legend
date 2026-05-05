/**
 * Centralized tracking utility.
 *
 * Dual-writes every event to:
 *   1. GA4 via window.gtag()
 *   2. Supabase via /api/track (POST or sendBeacon)
 *
 * Session context (id, UTMs, experiment) is stored in sessionStorage
 * so it persists across soft navigations but resets on new tabs.
 */

import { type ExperimentResult } from './ab-test';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SessionContext {
  session_id: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  experiment?: ExperimentResult;
}

interface TrackingPayload {
  session_id: string;
  event_name: string;
  page: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  experiment_id?: string;
  variant?: string;
  event_data: Record<string, unknown>;
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

const SESSION_KEY = 'cwb_session';

function parseUTMs(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const val = params.get(key);
    if (val) utms[key] = val;
  }
  return utms;
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function initSession(): SessionContext {
  if (typeof window === 'undefined') {
    return { session_id: '', referrer: '' };
  }

  // Return existing session if present
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      return JSON.parse(stored) as SessionContext;
    }
  } catch {
    // sessionStorage may be blocked
  }

  const utms = parseUTMs();

  const ctx: SessionContext = {
    session_id: generateSessionId(),
    referrer: document.referrer || '',
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_medium && { utm_medium: utms.utm_medium }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
    ...(utms.utm_term && { utm_term: utms.utm_term }),
    ...(utms.utm_content && { utm_content: utms.utm_content }),
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(ctx));
  } catch {
    // ignore
  }

  return ctx;
}

export function getSession(): SessionContext {
  if (typeof window === 'undefined') {
    return { session_id: '', referrer: '' };
  }

  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored) as SessionContext;
  } catch {
    // ignore
  }

  return initSession();
}

// ---------------------------------------------------------------------------
// Event dispatch
// ---------------------------------------------------------------------------

function buildPayload(
  eventName: string,
  data: Record<string, unknown>,
): TrackingPayload {
  const session = getSession();
  return {
    session_id: session.session_id,
    event_name: eventName,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: session.referrer,
    ...(session.utm_source && { utm_source: session.utm_source }),
    ...(session.utm_medium && { utm_medium: session.utm_medium }),
    ...(session.utm_campaign && { utm_campaign: session.utm_campaign }),
    ...(session.utm_term && { utm_term: session.utm_term }),
    ...(session.utm_content && { utm_content: session.utm_content }),
    ...(session.experiment && {
      experiment_id: session.experiment.experimentId,
      variant: session.experiment.variant,
    }),
    event_data: data,
  };
}

function fireGA4(eventName: string, data: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...data,
      page_path: window.location.pathname,
    });
  }
}

function postToAPI(payload: TrackingPayload): void {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Tracking failures are non-critical
    });
  } catch {
    // ignore
  }
}

/**
 * Track a named event with arbitrary data.
 * Dual-writes to GA4 and Supabase.
 */
export function trackEvent(
  eventName: string,
  data: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined') return;

  const payload = buildPayload(eventName, data);
  fireGA4(eventName, data);
  postToAPI(payload);
}

/**
 * Send a tracking event via sendBeacon (for beforeunload).
 * Does not use GA4 (unreliable during unload).
 */
export function trackBeacon(
  eventName: string,
  data: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined' || !navigator.sendBeacon) return;

  const payload = buildPayload(eventName, data);
  const blob = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });
  navigator.sendBeacon('/api/track', blob);
}
