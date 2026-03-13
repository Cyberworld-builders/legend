'use client';

import {
  Rocket,
  Target,
  RefreshCw,
  Truck,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Rocket,
    title: 'Rapid Prototyping',
    description:
      'Working software in weeks, not months. We scope aggressively — if it\'s not essential for validating the idea, it waits for v2.',
  },
  {
    icon: Target,
    title: 'Lean Validation',
    description:
      'Build the smallest thing that tests your hypothesis. Real users, real data, real feedback — before you invest in the full product.',
  },
  {
    icon: RefreshCw,
    title: 'Iterative Shipping',
    description:
      'Weekly deployments with working features. You see progress every week and can change direction based on what you learn.',
  },
  {
    icon: Truck,
    title: 'Production-Ready Foundation',
    description:
      'Even MVPs get proper auth, CI/CD, monitoring, and clean code. When the MVP validates, you scale — not rewrite.',
  },
];

const STEPS = [
  {
    title: 'Define Scope',
    description:
      'Ruthless prioritization. What\'s the core value proposition? What\'s the smallest feature set that tests it? We cut everything else.',
  },
  {
    title: '4-Week Sprint',
    description:
      'Week 1: foundation and auth. Week 2-3: core features. Week 4: polish, testing, and deployment. Working software every Friday.',
  },
  {
    title: 'Launch',
    description:
      'Deploy to production with real users. Set up analytics to measure the metrics that matter for validation.',
  },
  {
    title: 'Iterate',
    description:
      'Review user behavior, gather feedback, and plan the next sprint. Double down on what works, cut what doesn\'t.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Cemetery Management Application: GPS Mapping, AR Integration, and Autonomous Maintenance',
    href: '/blog/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes',
    image: '/images/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'Next.js Apps', href: '/services/custom-saas/nextjs-apps' },
  { title: 'Custom SaaS', href: '/services/custom-saas' },
  { title: 'AI Agents', href: '/services/automation/ai-agents' },
];

const FAQ = [
  {
    question: 'What can you build in 4 weeks?',
    answer:
      'A focused web application with 3-5 core features, user auth, a database, and deployment. Examples: a lead management tool, an internal dashboard, a booking system, or a content platform. The key is aggressive scoping — we build the thing that tests your idea, not the whole product.',
  },
  {
    question: 'What happens after the MVP launches?',
    answer:
      'You have three options: iterate with us on a retainer, hand the codebase to your team (it\'s clean and documented), or pause and see how the MVP performs. No lock-in.',
  },
  {
    question: 'How much does an MVP cost?',
    answer:
      'A 4-week MVP sprint is a fixed-price engagement. The exact cost depends on complexity, but we provide a detailed quote after the scoping session. No surprises, no hourly billing during the sprint.',
  },
  {
    question: 'What if the MVP fails to validate?',
    answer:
      'That\'s the point — you learn fast and cheap. A failed MVP costs a fraction of building the full product and finding out nobody wants it. We help you extract learnings and pivot if needed.',
  },
  {
    question: 'Do you work with non-technical founders?',
    answer:
      'Yes. Most of our MVP clients are domain experts, not engineers. We translate business requirements into technical scope and keep communication jargon-free. You don\'t need to know React to work with us.',
  },
];

export default function MvpDevelopmentContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Custom SaaS', href: '/services/custom-saas' },
        { label: 'MVP Development' },
      ]}
      heroTitle="Ship Your MVP in 4 Weeks"
      heroSubtitle="Rapid prototyping and lean validation. Real software in front of real users — before you invest in the full product."
      heroImage="/images/services/mvp-development-hero.png"
      capabilitiesTitle="What We Deliver"
      capabilities={CAPABILITIES}
      stepsTitle="How It Works"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready to Validate Your Idea?"
      contactSubtitle="Describe your product and we'll scope the MVP — free, no commitment."
    />
  );
}
