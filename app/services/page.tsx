import type { Metadata } from 'next';
import ServicesIndexContent from './ServicesIndexContent';

export const metadata: Metadata = {
  title: 'Services | Custom Software, Automation & Digital Marketing',
  description:
    'CyberWorld Builders offers digital marketing systems, AI-powered automation, and custom SaaS development. Talk to an engineer, not a salesperson.',
  keywords: [
    'custom software development',
    'digital marketing automation',
    'AI automation services',
    'SaaS development',
    'business automation',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services',
  },
  openGraph: {
    title: 'Services | Custom Software, Automation & Digital Marketing',
    description:
      'CyberWorld Builders offers digital marketing systems, AI-powered automation, and custom SaaS development. Talk to an engineer, not a salesperson.',
    url: 'https://cyberworldbuilders.com/services',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Custom Software, Automation & Digital Marketing',
    description:
      'CyberWorld Builders offers digital marketing systems, AI-powered automation, and custom SaaS development.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'CyberWorld Builders Services',
  description:
    'Digital marketing systems, AI-powered automation, and custom SaaS development for service businesses.',
  url: 'https://cyberworldbuilders.com/services',
  provider: {
    '@type': 'Organization',
    name: 'CyberWorld Builders',
    url: 'https://cyberworldbuilders.com',
  },
  serviceType: ['Digital Marketing', 'Automation', 'Custom Software Development'],
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <ServicesIndexContent />
    </>
  );
}
