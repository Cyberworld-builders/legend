import type { Metadata } from 'next';
import AiAgentsContent from './AiAgentsContent';

export const metadata: Metadata = {
  title: 'Custom AI Agent Development | Autonomous Task Agents',
  description:
    'Custom AI agents with tool-use, memory, and multi-step reasoning. Autonomous task handling with human oversight — built for production, not demos.',
  keywords: [
    'custom AI agent development',
    'AI agents',
    'autonomous AI agents',
    'AI tool use',
    'AI agent services',
    'multi-step AI reasoning',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/automation/ai-agents',
  },
  openGraph: {
    title: 'Custom AI Agent Development | Autonomous Task Agents',
    description: 'Custom AI agents with tool-use, memory, and multi-step reasoning for production use.',
    url: 'https://cyberworldbuilders.com/services/automation/ai-agents',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - AI Agent Development' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom AI Agent Development | Autonomous Task Agents',
    description: 'Custom AI agents with tool-use, memory, and multi-step reasoning.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom AI Agent Development',
  description: 'Custom AI agents with tool-use, memory, and multi-step reasoning for autonomous task handling with human oversight.',
  url: 'https://cyberworldbuilders.com/services/automation/ai-agents',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'AI Agent Development',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function AiAgentsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <AiAgentsContent />
    </>
  );
}
