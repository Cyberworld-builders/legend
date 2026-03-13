import type { Metadata } from 'next';
import ContentPipelineContent from './ContentPipelineContent';

export const metadata: Metadata = {
  title: 'Content Pipeline Automation | Transcript to Blog to Social',
  description:
    'Automated content pipelines that turn voice memos and transcripts into published blog posts with hero images, social copy, and cross-platform distribution.',
  keywords: [
    'content pipeline automation',
    'blog automation',
    'transcript to blog',
    'content marketing automation',
    'automated publishing',
    'social media distribution',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/digital-marketing/content-pipeline',
  },
  openGraph: {
    title: 'Content Pipeline Automation | Transcript to Blog to Social',
    description: 'Automated content pipelines from voice memo to published blog post with social distribution.',
    url: 'https://cyberworldbuilders.com/services/digital-marketing/content-pipeline',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - Content Pipeline' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Pipeline Automation | Transcript to Blog to Social',
    description: 'From voice memo to published blog post — fully automated content pipelines.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Content Pipeline Automation',
  description: 'Automated content pipelines that transform voice memos and transcripts into published blog posts with hero images and social distribution.',
  url: 'https://cyberworldbuilders.com/services/digital-marketing/content-pipeline',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'Content Marketing Automation',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function ContentPipelinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ContentPipelineContent />
    </>
  );
}
