'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), { ssr: false });
const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <GoogleAnalytics />
      <PerformanceMonitor />
    </>
  );
}
