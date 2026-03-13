'use client';

import {
  Eye,
  Plug,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Eye,
    title: 'Visual Workflow Builder',
    description:
      'Drag-and-drop workflow design that non-technical team members can understand and modify. Complex logic made visible.',
  },
  {
    icon: Plug,
    title: '400+ Integrations',
    description:
      'Native connectors for CRMs, email, databases, APIs, cloud services, and more. If it has an API, n8n can talk to it.',
  },
  {
    icon: AlertTriangle,
    title: 'Error Handling',
    description:
      'Built-in retry logic, error branches, and fallback workflows. When something fails, the system recovers or alerts — never silently breaks.',
  },
  {
    icon: BarChart3,
    title: 'Execution Monitoring',
    description:
      'Full execution history with step-by-step logs. See exactly what happened, when, and where things went wrong.',
  },
];

const STEPS = [
  {
    title: 'Map the Process',
    description:
      'Document the current manual workflow step by step. Identify triggers, data transformations, decision points, and outputs.',
  },
  {
    title: 'Build the Workflow',
    description:
      'Design and implement the n8n workflow with proper error handling, retry logic, and data validation at every step.',
  },
  {
    title: 'Test',
    description:
      'Run the workflow against real data in a staging environment. Verify edge cases, error paths, and performance under load.',
  },
  {
    title: 'Deploy',
    description:
      'Ship to your self-hosted n8n instance or our managed infrastructure. Set up monitoring, alerting, and backup schedules.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Code-First n8n Custom Nodes: Automation Workflow',
    href: '/blog/code-first-n8n-custom-nodes-automation-workflow',
    image: '/images/code-first-n8n-custom-nodes-automation-workflow-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'AI Agents', href: '/services/automation/ai-agents' },
  { title: 'AI Chatbots', href: '/services/automation/ai-chatbots' },
  { title: 'Automation', href: '/services/automation' },
];

const FAQ = [
  {
    question: 'Why n8n instead of Zapier or Make?',
    answer:
      'n8n is self-hosted and open-source. No per-execution pricing means your costs don\'t scale linearly with usage. For businesses running thousands of automations daily, this saves thousands per month. Plus you own the infrastructure — no vendor lock-in.',
  },
  {
    question: 'Do I need to self-host n8n?',
    answer:
      'Not necessarily. We can deploy on your infrastructure, set up a managed instance, or use n8n Cloud. Self-hosting gives you the most control and lowest cost at scale.',
  },
  {
    question: 'Can n8n handle complex business logic?',
    answer:
      'Yes. n8n supports conditional branching, loops, sub-workflows, custom JavaScript/Python functions, and webhook triggers. It handles everything from simple data syncs to complex multi-step business processes.',
  },
  {
    question: 'How do you handle workflow maintenance?',
    answer:
      'Workflows are version-controlled and documented. We set up monitoring that alerts on failures. Retainer clients get ongoing maintenance, optimization, and new workflow development.',
  },
  {
    question: 'Can n8n work alongside AI agents?',
    answer:
      'Absolutely. n8n orchestrates the workflow while AI agents handle the intelligent decision-making within steps. It\'s a powerful combination — n8n for reliable execution, AI for flexible reasoning.',
  },
];

export default function N8nWorkflowsContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Automation', href: '/services/automation' },
        { label: 'n8n Workflows' },
      ]}
      heroTitle="Workflow Automation Without the Per-Execution Tax"
      heroSubtitle="n8n visual workflows with 400+ integrations, proper error handling, and self-hosted infrastructure. Your automations, your data, your control."
      heroImage="/images/services/n8n-workflows-hero.png"
      capabilitiesTitle="What We Build"
      capabilities={CAPABILITIES}
      stepsTitle="How It Works"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready to Automate Your Workflows?"
      contactSubtitle="Tell us what processes eat your team's time and we'll map out the automation."
    />
  );
}
