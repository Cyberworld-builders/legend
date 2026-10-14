'use client';

import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <PerformanceMonitor />
    </>
  );
}
