import type { Metadata } from 'next';
import AiChatbotsContent from './AiChatbotsContent';

export const metadata: Metadata = {
  title: 'AI Chatbot Development | Business Chatbots & Lead Qualification',
  description:
    'Intelligent AI chatbots for your website, Telegram, and WhatsApp. RAG-powered knowledge bases, lead qualification, and human handoff — not scripted flows.',
  keywords: [
    'AI chatbot for business',
    'chatbot development',
    'AI chatbot services',
    'lead qualification chatbot',
    'RAG chatbot',
    'website chatbot',
  ],
  alternates: {
    canonical: 'https://cyberworldbuilders.com/services/automation/ai-chatbots',
  },
  openGraph: {
    title: 'AI Chatbot Development | Business Chatbots & Lead Qualification',
    description: 'Intelligent AI chatbots with RAG knowledge bases and lead qualification.',
    url: 'https://cyberworldbuilders.com/services/automation/ai-chatbots',
    siteName: 'CyberWorld Builders',
    type: 'website',
    images: [{ url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders - AI Chatbots' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot Development | Business Chatbots & Lead Qualification',
    description: 'Intelligent AI chatbots with RAG knowledge bases and lead qualification.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Chatbot Development',
  description: 'Intelligent AI chatbots for websites and messaging platforms with RAG knowledge bases, lead qualification, and human handoff.',
  url: 'https://cyberworldbuilders.com/services/automation/ai-chatbots',
  provider: { '@type': 'Organization', name: 'CyberWorld Builders', url: 'https://cyberworldbuilders.com' },
  serviceType: 'Chatbot Development',
  areaServed: { '@type': 'Country', name: 'United States' },
};

export default function AiChatbotsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <AiChatbotsContent />
    </>
  );
}
