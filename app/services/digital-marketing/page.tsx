import type { Metadata } from 'next';
import DigitalMarketingContent from './DigitalMarketingContent';

export const metadata: Metadata = {
  title: 'Digital Marketing Automation | SEO, Content Pipelines & GEO',
  description:
    'Automated content pipelines, AI-powered SEO audits, unified analytics dashboards, and generative engine optimization. Marketing systems that run without you.',
  keywords: [
    'digital marketing automation',
    'SEO services',
    'content marketing systems',
    'GEO optimization',
    'automated SEO audit',
    'content pipeline automation',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/digital-marketing',
  },
  openGraph: {
    title: 'Digital Marketing Automation | SEO, Content Pipelines & GEO',
    description:
      'Automated content pipelines, AI-powered SEO audits, unified analytics dashboards, and generative engine optimization.',
    url: 'https://cyberworldbuilders.com/services/digital-marketing',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Digital Marketing Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Automation | SEO, Content Pipelines & GEO',
    description:
      'Automated content pipelines, AI-powered SEO audits, and generative engine optimization.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Digital Marketing Automation',
  description:
    'Automated content pipelines, AI-powered SEO audits, unified analytics dashboards, and generative engine optimization for service businesses.',
  url: 'https://cyberworldbuilders.com/services/digital-marketing',
  provider: {
    '@type': 'Organization',
    name: 'CyberWorld Builders',
    url: 'https://cyberworldbuilders.com',
  },
  serviceType: 'Digital Marketing',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function DigitalMarketingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <DigitalMarketingContent />
    </>
  );
}
