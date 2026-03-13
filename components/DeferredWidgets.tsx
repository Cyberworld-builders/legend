'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false });
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

export default function DeferredWidgets() {
  const [loadChat, setLoadChat] = useState(false);

  useEffect(() => {
    // Defer ChatWidget until the browser is idle or 3s has passed,
    // whichever comes first. This keeps it off the critical path for TBT.
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => setLoadChat(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setLoadChat(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <GoogleAnalytics />
      <PerformanceMonitor />
      {loadChat && <ChatWidget />}
    </>
  );
}
