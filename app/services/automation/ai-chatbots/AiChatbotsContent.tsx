'use client';

import {
  Globe,
  MessageSquare,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Globe,
    title: 'Website Chat',
    description:
      'Embedded chat widget that answers visitor questions, qualifies leads, and captures contact info — 24/7 without a human in the loop.',
  },
  {
    icon: MessageSquare,
    title: 'Telegram & WhatsApp',
    description:
      'Deploy your chatbot to the messaging platforms your customers already use. Same knowledge base, same persona, multiple channels.',
  },
  {
    icon: UserCheck,
    title: 'Lead Qualification',
    description:
      'Intelligent conversation flows that identify qualified leads, capture requirements, and route them to the right person on your team.',
  },
  {
    icon: BookOpen,
    title: 'RAG Knowledge Base',
    description:
      'Your chatbot answers from your actual documentation, FAQs, and content — not hallucinated responses. Retrieval-Augmented Generation keeps it grounded.',
  },
];

const STEPS = [
  {
    title: 'Define Persona',
    description:
      'Establish the chatbot\'s voice, knowledge boundaries, and escalation rules. What should it answer? What should it punt to a human?',
  },
  {
    title: 'Train',
    description:
      'Index your documentation, FAQs, and content into a vector database. The chatbot learns your business from your own materials.',
  },
  {
    title: 'Deploy',
    description:
      'Launch on your website, Telegram, WhatsApp, or all three. Configure lead capture, notification routing, and analytics.',
  },
  {
    title: 'Iterate',
    description:
      'Review conversation logs, identify gaps in the knowledge base, and refine responses. Chatbots get smarter with real usage data.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Chatbot Breakthrough: How OpenAI\'s Web Crawling Validates Generative SEO',
    href: '/blog/chatbot-breakthrough-how-openais-web-crawling-validates-generative-seo-for-smarter-site-interactions',
    image: '/images/chatbot-breakthrough-how-openais-web-crawling-validates-generative-seo-for-smarter-site-interactions-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'AI Agents', href: '/services/automation/ai-agents' },
  { title: 'n8n Workflows', href: '/services/automation/n8n-workflows' },
  { title: 'Automation', href: '/services/automation' },
];

const FAQ = [
  {
    question: 'How is this different from Intercom or Drift?',
    answer:
      'Those tools use scripted conversation flows. Our chatbots use LLMs with RAG — they understand natural language and answer from your actual content. No decision trees to maintain, no canned responses to write.',
  },
  {
    question: 'What happens when the chatbot can\'t answer?',
    answer:
      'It escalates to a human. You configure the threshold — the bot can hand off immediately for certain topics, or try to help first and escalate if the user isn\'t satisfied. Handoff includes the full conversation context.',
  },
  {
    question: 'Can the chatbot access our internal systems?',
    answer:
      'Yes, with proper authentication and scoping. The chatbot can query your CRM, check order status, look up account details, and more — within the boundaries you define.',
  },
  {
    question: 'How do you prevent hallucinations?',
    answer:
      'RAG grounds the chatbot\'s responses in your actual content. We also implement guardrails: if the bot isn\'t confident in its answer, it says so and offers to connect with a human instead of making something up.',
  },
  {
    question: 'What does it cost to run?',
    answer:
      'LLM API costs are typically $50-200/month for moderate traffic (1,000-5,000 conversations/month). Infrastructure costs depend on hosting choice. We provide transparent cost projections during scoping.',
  },
];

export default function AiChatbotsContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Automation', href: '/services/automation' },
        { label: 'AI Chatbots' },
      ]}
      heroTitle="AI Chatbots That Actually Help Your Customers"
      heroSubtitle="Intelligent chatbots powered by your real content — not scripted flows. Website, Telegram, WhatsApp deployment with lead qualification and human handoff."
      heroImage="/images/services/ai-chatbots-hero.png"
      capabilitiesTitle="What We Build"
      capabilities={CAPABILITIES}
      stepsTitle="How We Build Them"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready for a Smarter Chatbot?"
      contactSubtitle="Tell us about your customer support workflow and we'll design the bot."
    />
  );
}
