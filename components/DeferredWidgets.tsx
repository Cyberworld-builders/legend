'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import TerminalWhisper from '@/components/TerminalWhisper';

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false });
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), { ssr: false });

export default function DeferredWidgets() {
  const [loadTerminal, setLoadTerminal] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setLoadTerminal(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setLoadTerminal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <GoogleAnalytics />
      <PerformanceMonitor />
      {loadTerminal && <TerminalWhisper />}
    </>
  );
}
