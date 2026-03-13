import type { Metadata } from 'next';
import N8nWorkflowsContent from './N8nWorkflowsContent';

export const metadata: Metadata = {
  title: 'n8n Workflow Automation | Visual Automation Development',
  description:
    'n8n workflow automation with 400+ integrations, visual workflow builder, error handling, and monitoring. Self-hosted, no per-execution pricing.',
  keywords: [
    'n8n automation development',
    'n8n workflows',
    'workflow automation',
    'n8n integrations',
    'business process automation',
    'visual workflow builder',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/automation/n8n-workflows',
  },
  openGraph: {
    title: 'n8n Workflow Automation | Visual Automation Development',
    description: 'n8n workflow automation with 400+ integrations and no per-execution pricing.',
    url: 'https://cyberworldbuilders.com/services/automation/n8n-workflows',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - n8n Workflows' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n8n Workflow Automation | Visual Automation Development',
    description: 'n8n workflow automation with 400+ integrations.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'n8n Workflow Automation',
  description: 'Visual workflow automation with 400+ integrations, error handling, and monitoring. Self-hosted with no per-execution pricing.',
  url: 'https://cyberworldbuilders.com/services/automation/n8n-workflows',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'Workflow Automation',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function N8nWorkflowsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <N8nWorkflowsContent />
    </>
  );
}
