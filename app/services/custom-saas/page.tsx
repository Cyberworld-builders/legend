import type { Metadata } from 'next';
import CustomSaasContent from './CustomSaasContent';

export const metadata: Metadata = {
  title: 'Custom SaaS Development | Next.js Apps & MVP Development',
  description:
    'Full-stack Next.js web applications, cloud infrastructure, and MVP development built around your business. Custom software that fits — no vendor lock-in.',
  keywords: [
    'custom SaaS development',
    'Next.js web applications',
    'MVP development',
    'custom software development',
    'full-stack development',
    'web application development',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/custom-saas',
  },
  openGraph: {
    title: 'Custom SaaS Development | Next.js Apps & MVP Development',
    description:
      'Full-stack Next.js web applications, cloud infrastructure, and MVP development built around your business.',
    url: 'https://cyberworldbuilders.com/services/custom-saas',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Custom SaaS Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom SaaS Development | Next.js Apps & MVP Development',
    description:
      'Full-stack Next.js applications and MVP development built around your business.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom SaaS Development',
  description:
    'Full-stack Next.js web applications, cloud infrastructure, API development, and MVP-first approach for service businesses.',
  url: 'https://cyberworldbuilders.com/services/custom-saas',
  provider: {
    '@type': 'Organization',
    name: 'CyberWorld Builders',
    url: 'https://cyberworldbuilders.com',
  },
  serviceType: 'Custom Software Development',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function CustomSaasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <CustomSaasContent />
    </>
  );
}
