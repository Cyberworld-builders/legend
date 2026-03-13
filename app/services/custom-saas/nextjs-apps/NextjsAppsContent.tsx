'use client';

import {
  Server,
  FileCode,
  Plug,
  Palette,
  Search,
  Layers,
  Hammer,
  Rocket,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Server,
    title: 'SSR & SSG',
    description:
      'Server-side rendering for dynamic content and static generation for speed. The right rendering strategy for each page, not a one-size-fits-all approach.',
  },
  {
    icon: FileCode,
    title: 'App Router & API Routes',
    description:
      'Next.js 14+ App Router with server components, streaming, and built-in API routes. Modern patterns that keep your codebase clean as it scales.',
  },
  {
    icon: Palette,
    title: 'Tailwind CSS',
    description:
      'Utility-first CSS that ships zero unused styles. Responsive, accessible, and consistent design without fighting a CSS framework.',
  },
  {
    icon: Plug,
    title: 'Supabase Integration',
    description:
      'PostgreSQL database, auth, real-time subscriptions, and storage — all through Supabase. The open-source Firebase alternative that doesn\'t lock you in.',
  },
];

const STEPS = [
  {
    title: 'Discovery',
    description:
      'Understand your business requirements, user flows, and technical constraints. Define the scope and pick the right tools for the job.',
  },
  {
    title: 'Prototype',
    description:
      'Build a working prototype with core features. Real code, real data, real deployment — not a mockup or wireframe.',
  },
  {
    title: 'Build',
    description:
      'Full implementation with testing, CI/CD, monitoring, and documentation. Iterative delivery — you see working code every week.',
  },
  {
    title: 'Deploy',
    description:
      'Ship to Vercel, AWS, or your preferred platform with production-grade infrastructure, SSL, CDN, and monitoring.',
  },
];

const BLOG_POSTS = [
  {
    title: 'The Power of Flat Files in Blogging: Repurposing Coding Tools for Content Creation',
    href: '/blog/the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
    image: '/images/the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'MVP Development', href: '/services/custom-saas/mvp-development' },
  { title: 'Custom SaaS', href: '/services/custom-saas' },
  { title: 'AI Chatbots', href: '/services/automation/ai-chatbots' },
];

const FAQ = [
  {
    question: 'Why Next.js?',
    answer:
      'Next.js gives you server-side rendering, static generation, API routes, and an excellent developer experience in one framework. It\'s used by Vercel, Netflix, TikTok, and thousands of production applications. It\'s the most practical choice for full-stack React applications.',
  },
  {
    question: 'Can you work with an existing Next.js codebase?',
    answer:
      'Yes. We do codebase audits, upgrade legacy pages to App Router, optimize performance, and add new features. We can work within your existing architecture or propose incremental improvements.',
  },
  {
    question: 'What about hosting?',
    answer:
      'Vercel is the simplest and most performant option for Next.js. We also deploy to AWS (Amplify, EC2, or Lambda@Edge) and self-hosted setups. Hosting choice depends on your budget, compliance needs, and existing infrastructure.',
  },
  {
    question: 'Do you do design work?',
    answer:
      'We implement designs, not create them from scratch. If you have a designer, we work from their Figma files. If you don\'t, we use clean, functional UI patterns with Tailwind CSS that look professional without a custom design phase.',
  },
  {
    question: 'How do you handle databases?',
    answer:
      'Supabase (PostgreSQL) is our default recommendation — it\'s open-source, has great DX, and includes auth, real-time, and storage. We also work with PlanetScale, Prisma, and direct PostgreSQL depending on your needs.',
  },
];

export default function NextjsAppsContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Custom SaaS', href: '/services/custom-saas' },
        { label: 'Next.js Apps' },
      ]}
      heroTitle="Next.js Applications Built for Production"
      heroSubtitle="Full-stack Next.js with SSR, App Router, Tailwind, and Supabase. Modern web applications that ship fast and scale cleanly."
      heroImage="/images/services/nextjs-apps-hero.png"
      capabilitiesTitle="What We Build"
      capabilities={CAPABILITIES}
      stepsTitle="How We Build"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready to Build Your App?"
      contactSubtitle="Describe your project and we'll scope it out — no commitment required."
    />
  );
}
