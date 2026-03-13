import type { Metadata } from 'next';
import GeoOptimizationContent from './GeoOptimizationContent';

export const metadata: Metadata = {
  title: 'GEO Optimization | Generative Engine Optimization Services',
  description:
    'Get your content cited by ChatGPT, Perplexity, and Google AI Overviews. Question-based headers, citation density, E-E-A-T signals, and AI crawler access.',
  keywords: [
    'generative engine optimization',
    'GEO optimization',
    'AI search optimization',
    'ChatGPT SEO',
    'AI overview optimization',
    'E-E-A-T signals',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/digital-marketing/geo-optimization',
  },
  openGraph: {
    title: 'GEO Optimization | Generative Engine Optimization Services',
    description:
      'Get your content cited by ChatGPT, Perplexity, and Google AI Overviews with generative engine optimization.',
    url: 'https://cyberworldbuilders.com/services/digital-marketing/geo-optimization',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - GEO Optimization' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GEO Optimization | Generative Engine Optimization Services',
    description: 'Get your content cited by AI search engines with generative engine optimization.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'GEO Optimization',
  description: 'Generative Engine Optimization — get your content cited by AI search engines like ChatGPT, Perplexity, and Google AI Overviews.',
  url: 'https://cyberworldbuilders.com/services/digital-marketing/geo-optimization',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'Generative Engine Optimization',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function GeoOptimizationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <GeoOptimizationContent />
    </>
  );
}
