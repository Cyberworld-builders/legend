import type { Metadata } from 'next';
import MvpDevelopmentContent from './MvpDevelopmentContent';

export const metadata: Metadata = {
  title: 'MVP Development Service | Rapid Prototyping & Lean Validation',
  description:
    'Ship a working MVP in 4 weeks. Rapid prototyping, lean validation, and iterative development — real software in front of real users, fast.',
  keywords: [
    'MVP development service',
    'MVP development',
    'rapid prototyping',
    'lean validation',
    'startup MVP',
    'minimum viable product',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/custom-saas/mvp-development',
  },
  openGraph: {
    title: 'MVP Development Service | Rapid Prototyping & Lean Validation',
    description: 'Ship a working MVP in 4 weeks with rapid prototyping and lean validation.',
    url: 'https://cyberworldbuilders.com/services/custom-saas/mvp-development',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - MVP Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MVP Development Service | Rapid Prototyping & Lean Validation',
    description: 'Ship a working MVP in 4 weeks with rapid prototyping and lean validation.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'MVP Development',
  description: 'Rapid MVP development — ship a working product in 4 weeks with lean validation and iterative shipping.',
  url: 'https://cyberworldbuilders.com/services/custom-saas/mvp-development',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'MVP Development',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function MvpDevelopmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <MvpDevelopmentContent />
    </>
  );
}
