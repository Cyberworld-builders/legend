'use client';

import dynamic from 'next/dynamic';

// Load Vercel Analytics only on the client to avoid RSC chunk resolution
// (undefined factory) when layout is serialized. See GH next.js #70703 / webpack .call.
const Analytics = dynamic(
  () => import('@vercel/analytics/next').then((mod) => mod.Analytics),
  { ssr: false }
);

export default function AnalyticsClient() {
  return <Analytics />;
}
