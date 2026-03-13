import type { Metadata } from 'next';
import CemeteryContent from './CemeteryContent';

export const metadata: Metadata = {
  title: 'Cemetery Management Software | AI-Powered Property Management',
  description:
    'Custom cemetery management software with GPS grave navigation, AI maintenance detection, drone monitoring, and smart work orders.',
  keywords: [
    'cemetery software',
    'cemetery management software',
    'death care technology',
    'cemetery GPS',
    'grave locator',
    'memorial park software',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/cemetery-software',
  },
  openGraph: {
    title: 'Cemetery Management Software | AI-Powered Property Management',
    description:
      'Custom cemetery management software with GPS grave navigation, AI maintenance detection, drone monitoring, and smart work orders.',
    url: 'https://cyberworldbuilders.com/cemetery-software',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Cemetery Management Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cemetery Management Software | AI-Powered Property Management',
    description:
      'Custom cemetery management software with GPS grave navigation, AI maintenance detection, drone monitoring, and smart work orders.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EternaGuard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI-powered cemetery management software with GPS plot navigation, drone monitoring, and smart maintenance workflows.',
  url: 'https://eternaguard.cyberworldbuilders.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free working demo available',
  },
  provider: {
    '@type': 'Organization',
    name: 'CyberWorld Builders',
    url: 'https://cyberworldbuilders.com',
  },
  featureList: [
    'GPS Plot Navigation',
    'AI Maintenance Detection',
    'Drone Monitoring',
    'Smart Task Management',
    'Natural Language Search',
    'CRM & CMS Integration',
  ],
};

export default function CemeterySoftwarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <CemeteryContent />
    </>
  );
}
