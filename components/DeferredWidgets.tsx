'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false });
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <GoogleAnalytics />
      <PerformanceMonitor />
      <ChatWidget />
    </>
  );
}
