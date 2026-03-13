'use client';

import {
  Repeat,
  Unplug,
  BrainCircuit,
  AlertTriangle,
  Bot,
  Workflow,
  MessageSquare,
  Activity,
  Zap,
  Shield,
  Wrench,
} from 'lucide-react';
import ServicePageLayout from '@/components/ServicePageLayout';

const PAIN_POINTS = [
  {
    icon: Repeat,
    title: 'Manual Workflows',
    description:
      'Copy-pasting between apps, manually entering data, and doing the same repetitive tasks every day. Your team is stuck doing robot work.',
  },
  {
    icon: Unplug,
    title: 'Disconnected Tools',
    description:
      'Your CRM doesn\'t talk to your invoicing. Your email doesn\'t sync with your project manager. Data lives in silos that nobody can bridge.',
  },
  {
    icon: BrainCircuit,
    title: 'No AI Integration',
    description:
      'You know AI could help but don\'t know where to start. Off-the-shelf chatbots are too dumb. Building from scratch seems impossible.',
  },
  {
    icon: AlertTriangle,
    title: 'Brittle Scripts',
    description:
      'Someone wrote a script that kind of works — until it doesn\'t. No error handling, no monitoring, no one who remembers how it works.',
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Autonomous agents that handle multi-step tasks — research, data processing, report generation, and decision support with human oversight.',
  },
  {
    icon: Workflow,
    title: 'n8n Orchestration',
    description:
      'Visual workflow automation with 400+ integrations. Connect any combination of tools with proper error handling and retry logic.',
  },
  {
    icon: MessageSquare,
    title: 'Chatbot Integration',
    description:
      'Intelligent chatbots for your website, Telegram, or WhatsApp. RAG-powered knowledge bases, lead qualification, and human handoff.',
  },
  {
    icon: Activity,
    title: 'Pipeline Monitoring',
    description:
      'Real-time observability for every automation. Track timing, errors, and throughput. Get alerted before problems reach your customers.',
  },
];

const SUB_SERVICES = [
  {
    href: '/services/automation/ai-agents',
    icon: Bot,
    title: 'AI Agent Development',
    description:
      'Custom AI agents that handle autonomous tasks with tool-use, memory, and multi-step reasoning.',
    tags: ['Autonomous', 'Tool-Use', 'Multi-Step'],
  },
  {
    href: '/services/automation/n8n-workflows',
    icon: Workflow,
    title: 'n8n Workflow Automation',
    description:
      'Visual workflow orchestration with 400+ integrations, error handling, and monitoring built in.',
    tags: ['400+ Integrations', 'Visual Builder', 'Error Handling'],
  },
  {
    href: '/services/automation/ai-chatbots',
    icon: MessageSquare,
    title: 'AI Chatbot Development',
    description:
      'Intelligent chatbots for your website and messaging platforms with RAG and lead qualification.',
    tags: ['Website Chat', 'Telegram', 'Lead Qualification'],
  },
];

const BLOG_POSTS = [
  {
    title: 'My First Real Outage and What It Taught Me About Autonomous Systems',
    href: '/blog/first-real-outage-autonomous-systems',
    image: '/images/first-real-outage-autonomous-systems-hero.png',
  },
  {
    title: 'From Zapier to n8n: Automation Practice',
    href: '/blog/from-zapier-to-n8n-automation-practice',
    image: '/images/from-zapier-to-n8n-automation-practice-hero.png',
  },
];

const WHY_US = [
  {
    icon: Zap,
    title: 'Production-Grade',
    description:
      'We don\'t build demos. Every automation ships with error handling, monitoring, alerting, and retry logic. Built to run unattended.',
  },
  {
    icon: Shield,
    title: 'Battle-Tested Patterns',
    description:
      'Our own business runs on the same automation stack — AI agents, n8n workflows, chatbots, and monitoring. We eat our own cooking.',
  },
  {
    icon: Wrench,
    title: 'Full Ownership',
    description:
      'You own the code, the workflows, and the infrastructure. No vendor lock-in, no per-seat licensing, no surprise bills.',
  },
];

const FAQ = [
  {
    question: 'What kind of tasks can AI agents handle?',
    answer:
      'Research and data gathering, report generation, content processing, lead qualification, email triage, scheduling, and any multi-step task that follows a definable process. We build agents with tool-use capabilities and human-in-the-loop oversight for high-stakes decisions.',
  },
  {
    question: 'Why n8n instead of Zapier or Make?',
    answer:
      'n8n is self-hosted, open-source, and has no per-execution pricing. For businesses doing serious automation (thousands of executions/day), it\'s dramatically cheaper and more flexible. Plus you own the infrastructure — no vendor lock-in.',
  },
  {
    question: 'Can you integrate with our existing tools?',
    answer:
      'n8n has 400+ built-in integrations covering CRMs, email providers, databases, APIs, and more. For custom tools, we build HTTP/webhook integrations. If it has an API, we can connect it.',
  },
  {
    question: 'How do you handle errors in automations?',
    answer:
      'Every workflow includes error handling, retry logic, and alerting. Critical failures notify your team via Telegram or email. We also build observability dashboards so you can see execution history and diagnose issues.',
  },
  {
    question: 'What does a chatbot project look like?',
    answer:
      'We define the bot\'s persona and knowledge base, connect it to your data sources via RAG, deploy it to your website or messaging platform, and iterate based on real conversations. Typical timeline is 2-4 weeks from kickoff to live.',
  },
];

export default function AutomationContent() {
  return (
    <ServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Automation' },
      ]}
      heroTitle="AI Automation That Actually Works in Production"
      heroSubtitle="Custom AI agents, n8n workflow orchestration, and intelligent chatbots — built with error handling, monitoring, and the expectation that things will go wrong."
      heroImage="/images/services/automation-hero.png"
      painPointsTitle="Why Your Team Is Doing Robot Work"
      painPoints={PAIN_POINTS}
      featuresTitle="What We Build"
      features={FEATURES}
      subServices={SUB_SERVICES}
      blogPosts={BLOG_POSTS}
      whyUs={WHY_US}
      faq={FAQ}
      contactTitle="Ready to Automate the Boring Stuff?"
      contactSubtitle="Tell us what's eating your team's time and we'll show you what's possible."
    />
  );
}
