'use client';

import { useEffect } from 'react';

const INGEST_URL = 'http://127.0.0.1:7245/ingest/09142726-0b46-49c0-b91d-40a2cb60bfcb';

export default function DebugErrorReporter() {
  useEffect(() => {
    // #region agent log
    const handler = (event: ErrorEvent) => {
      const payload = {
        location: 'DebugErrorReporter:onerror',
        message: event.message ?? 'unknown',
        data: {
          pathname: typeof window !== 'undefined' ? window.location.pathname : '',
          href: typeof window !== 'undefined' ? window.location.href : '',
          stack: event.error?.stack ?? '',
          filename: event.filename ?? '',
          lineno: event.lineno,
          colno: event.colno,
          hypothesisId: 'H1-H5',
          sessionId: 'debug-session',
          runId: 'run1',
        },
        timestamp: Date.now(),
      };
      fetch(INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
    // #endregion
  }, []);
  return null;
}
