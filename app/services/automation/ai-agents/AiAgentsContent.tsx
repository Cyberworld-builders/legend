'use client';

import {
  Wrench,
  Brain,
  GitBranch,
  Shield,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Wrench,
    title: 'Tool-Use Agents',
    description:
      'Agents that call APIs, query databases, execute code, and interact with external systems to accomplish tasks autonomously.',
  },
  {
    icon: Brain,
    title: 'Memory & Context',
    description:
      'Persistent memory across sessions. Agents remember past interactions, learn preferences, and build context over time.',
  },
  {
    icon: GitBranch,
    title: 'Multi-Step Reasoning',
    description:
      'Complex task decomposition — agents break big problems into steps, execute them in order, and handle branching logic.',
  },
  {
    icon: Shield,
    title: 'Human Oversight',
    description:
      'Configurable approval gates for high-stakes decisions. Agents work autonomously on routine tasks but escalate when needed.',
  },
];

const STEPS = [
  {
    title: 'Define Scope',
    description:
      'Map out the tasks the agent will handle, the tools it needs access to, and the boundaries of its autonomy.',
  },
  {
    title: 'Build',
    description:
      'Develop the agent with appropriate LLM backbone, tool integrations, memory system, and safety rails.',
  },
  {
    title: 'Test',
    description:
      'Run the agent through real-world scenarios with monitoring. Verify tool-use accuracy, reasoning quality, and edge case handling.',
  },
  {
    title: 'Deploy',
    description:
      'Ship to production with observability, logging, and alerting. Track every decision the agent makes.',
  },
  {
    title: 'Monitor',
    description:
      'Continuous monitoring of agent performance, cost, latency, and accuracy. Iterate based on real usage patterns.',
  },
];

const BLOG_POSTS = [
  {
    title: 'The GusClaw Observatory: Watching My AI Team Work',
    href: '/blog/gusclaw-observatory-watching-ai-team-work',
    image: '/images/gusclaw-observatory-watching-ai-team-work-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'n8n Workflows', href: '/services/automation/n8n-workflows' },
  { title: 'AI Chatbots', href: '/services/automation/ai-chatbots' },
  { title: 'Automation', href: '/services/automation' },
];

const FAQ = [
  {
    question: 'What tasks can AI agents handle?',
    answer:
      'Research and data gathering, report generation, content processing, email triage, lead qualification, scheduling, data entry, and any multi-step process that follows definable logic. The key requirement is that the task has clear inputs, outputs, and success criteria.',
  },
  {
    question: 'What LLMs do you use?',
    answer:
      'We pick the right model for the job. Claude for complex reasoning and long-context tasks. GPT-4 for broad tool-use. Smaller models for high-volume, lower-complexity tasks. We optimize for cost and performance, not brand loyalty.',
  },
  {
    question: 'How do you prevent agents from going off the rails?',
    answer:
      'Structured output schemas, approval gates for high-impact actions, budget limits on API calls, and comprehensive logging of every decision. We build agents that fail safely and escalate when uncertain.',
  },
  {
    question: 'What does agent monitoring look like?',
    answer:
      'Every LLM call is logged with timing, token usage, and pipeline context. You get dashboards showing task completion rates, cost per execution, error rates, and escalation frequency.',
  },
];

export default function AiAgentsContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Automation', href: '/services/automation' },
        { label: 'AI Agents' },
      ]}
      heroTitle="AI Agents That Work While You Sleep"
      heroSubtitle="Custom AI agents with tool-use, memory, and multi-step reasoning — built for production reliability, not conference demos."
      heroImage="/images/services/ai-agents-hero.png"
      capabilitiesTitle="What We Build"
      capabilities={CAPABILITIES}
      stepsTitle="How We Build Them"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready to Build an Agent?"
      contactSubtitle="Describe the task you want to automate and we'll scope the agent."
    />
  );
}
