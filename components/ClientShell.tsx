'use client';

import dynamic from 'next/dynamic';

const ScrollTracker = dynamic(() => import('./ScrollTracker'), { ssr: false });

const TRACKED_SECTIONS = ['hero', 'services', 'featured', 'about', 'contact', 'faq'];

export default function ClientShell() {
  return <ScrollTracker sections={TRACKED_SECTIONS} />;
}
