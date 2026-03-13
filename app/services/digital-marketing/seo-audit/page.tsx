import type { Metadata } from 'next';
import SeoAuditContent from './SeoAuditContent';

export const metadata: Metadata = {
  title: 'Automated SEO Audit Service | Technical SEO & Auto-Fix',
  description:
    'Continuous automated SEO audits that crawl, score, and auto-fix technical issues. Schema validation, crawlability checks, and on-page optimization — running 24/7.',
  keywords: [
    'automated SEO audit',
    'technical SEO audit',
    'SEO audit service',
    'automated SEO fix',
    'technical SEO monitoring',
    'schema validation',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/digital-marketing/seo-audit',
  },
  openGraph: {
    title: 'Automated SEO Audit Service | Technical SEO & Auto-Fix',
    description: 'Continuous automated SEO audits that crawl, score, and auto-fix technical issues.',
    url: 'https://cyberworldbuilders.com/services/digital-marketing/seo-audit',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - SEO Audit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automated SEO Audit Service | Technical SEO & Auto-Fix',
    description: 'Continuous SEO audits with automated crawling, scoring, and auto-fixing.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automated SEO Audit',
  description: 'Continuous automated SEO audits that crawl, score, and auto-fix technical issues for your website.',
  url: 'https://cyberworldbuilders.com/services/digital-marketing/seo-audit',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'SEO Audit',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function SeoAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <SeoAuditContent />
    </>
  );
}
