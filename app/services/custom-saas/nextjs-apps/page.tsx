import type { Metadata } from 'next';
import NextjsAppsContent from './NextjsAppsContent';

export const metadata: Metadata = {
  title: 'Next.js Development Services | Full-Stack Web Applications',
  description:
    'Full-stack Next.js web applications with SSR, App Router, API routes, Tailwind CSS, and Supabase. Production-grade from day one.',
  keywords: [
    'Next.js development services',
    'Next.js web applications',
    'React development',
    'full-stack Next.js',
    'Next.js App Router',
    'Supabase development',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/custom-saas/nextjs-apps',
  },
  openGraph: {
    title: 'Next.js Development Services | Full-Stack Web Applications',
    description: 'Full-stack Next.js web applications with SSR, App Router, and Supabase.',
    url: 'https://cyberworldbuilders.com/services/custom-saas/nextjs-apps',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - Next.js Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Development Services | Full-Stack Web Applications',
    description: 'Full-stack Next.js web applications with SSR, App Router, and Supabase.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Next.js Development Services',
  description: 'Full-stack Next.js web applications with SSR, App Router, API routes, Tailwind CSS, and Supabase.',
  url: 'https://cyberworldbuilders.com/services/custom-saas/nextjs-apps',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'Web Application Development',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function NextjsAppsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <NextjsAppsContent />
    </>
  );
}
