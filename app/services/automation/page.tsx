import type { Metadata } from 'next';
import AutomationContent from './AutomationContent';

export const metadata: Metadata = {
  title: 'AI Automation Services | Agents, Workflows & Chatbots',
  description:
    'Custom AI agents, n8n workflow orchestration, and intelligent chatbot development. Eliminate manual work and connect your tools with automation that scales.',
  keywords: [
    'AI automation services',
    'business process automation',
    'chatbot development',
    'AI agent development',
    'n8n automation',
    'workflow automation',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/automation',
  },
  openGraph: {
    title: 'AI Automation Services | Agents, Workflows & Chatbots',
    description:
      'Custom AI agents, n8n workflow orchestration, and intelligent chatbot development for service businesses.',
    url: 'https://cyberworldbuilders.com/services/automation',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - AI Automation Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Services | Agents, Workflows & Chatbots',
    description:
      'Custom AI agents, n8n workflow orchestration, and intelligent chatbot development.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation Services',
  description:
    'Custom AI agents, n8n workflow orchestration, and intelligent chatbot development for service businesses.',
  url: 'https://cyberworldbuilders.com/services/automation',
  provider: {
    '@type': 'Organization',
    name: 'CyberWorld Builders',
    url: 'https://cyberworldbuilders.com',
  },
  serviceType: 'Business Process Automation',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function AutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <AutomationContent />
    </>
  );
}
