'use client';

import Link from 'next/link';
import {
  Package,
  Bug,
  UserX,
  Lock,
  Code2,
  Cloud,
  Plug,
  Rocket,
  Cpu,
  Shield,
  Wrench,
} from 'lucide-react';
import ServicePageLayout from '@/components/ServicePageLayout';

const PAIN_POINTS = [
  {
    icon: Package,
    title: 'Off-the-Shelf Doesn\'t Fit',
    description:
      'You\'ve tried SaaS products that almost work but force you into someone else\'s workflow. Workarounds become the workflow.',
  },
  {
    icon: Bug,
    title: 'Drowning in Tech Debt',
    description:
      'The codebase grew organically. Nobody refactored. Now every new feature takes 3x longer and breaks something else.',
  },
  {
    icon: UserX,
    title: 'Can\'t Find Devs Who Get the Business',
    description:
      'Freelancers who write good code but don\'t understand your domain. Agencies that understand the domain but outsource the code.',
  },
  {
    icon: Lock,
    title: 'Vendor Lock-In',
    description:
      'Your critical business logic lives inside a platform you don\'t control. Pricing goes up, features get deprecated, and you can\'t leave.',
  },
];

const FEATURES = [
  {
    icon: Code2,
    title: 'Full-Stack Next.js & React',
    description:
      'Server-side rendering, static generation, API routes, and modern React patterns. Production-grade applications built on the framework Vercel trusts.',
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description:
      'Vercel, AWS, or self-hosted — we set up CI/CD, monitoring, and scaling that fits your needs and budget.',
  },
  {
    icon: Plug,
    title: 'API Development',
    description:
      'REST and webhook APIs that connect your systems. Clean interfaces, proper auth, rate limiting, and documentation.',
  },
  {
    icon: Rocket,
    title: 'MVP-First Approach',
    description:
      'Ship a working product in weeks, not months. Validate with real users, then iterate. No 6-month spec phases.',
  },
];

const SUB_SERVICES = [
  {
    href: '/services/custom-saas/nextjs-apps',
    icon: Code2,
    title: 'Next.js Web Applications',
    description:
      'Full-stack Next.js apps with SSR, App Router, Tailwind, and Supabase. Production-grade from day one.',
    tags: ['Next.js', 'React', 'Supabase'],
  },
  {
    href: '/services/custom-saas/mvp-development',
    icon: Rocket,
    title: 'MVP Development',
    description:
      'Rapid prototyping and lean validation. Get a working product in front of users in 4 weeks.',
    tags: ['Rapid Prototyping', '4-Week Sprint', 'Lean Validation'],
  },
];

const BLOG_POSTS = [
  {
    title: 'Cemetery Management Application: GPS Mapping, AR Integration, and Autonomous Maintenance',
    href: '/blog/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes',
    image: '/images/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes-hero.png',
  },
  {
    title: 'Revisiting Old Code: Lessons in Growth, Enterprise vs Startup Mindsets',
    href: '/blog/revisiting-old-code-lessons-in-growth-enterprise-vs-startup-mindsets-and-ai-driven-infrastructure-evolution',
    image: '/images/revisiting-old-code-lessons-in-growth-enterprise-vs-startup-mindsets-and-ai-driven-infrastructure-evolution-hero.png',
  },
];

const WHY_US = [
  {
    icon: Cpu,
    title: 'Engineer-Led',
    description:
      'You talk directly to the person writing the code. No project managers playing telephone. No offshore handoffs.',
  },
  {
    icon: Shield,
    title: 'You Own Everything',
    description:
      'Every line of code, every deployment config, every database. No licensing traps, no proprietary lock-in.',
  },
  {
    icon: Wrench,
    title: 'Built to Maintain',
    description:
      'Clean code, proper testing, and CI/CD from the start. Your next developer — or your future self — will thank you.',
  },
];

const FAQ = [
  {
    question: 'What tech stack do you use?',
    answer:
      'Next.js and React for the frontend, with Tailwind CSS for styling. Supabase or PostgreSQL for the database. Vercel or AWS for hosting. TypeScript everywhere. We pick proven tools that have strong ecosystems and long-term support.',
  },
  {
    question: 'How fast can you ship an MVP?',
    answer:
      'A focused MVP typically ships in 4 weeks. That means a working product with core features, not a mockup. We scope aggressively — if it\'s not essential for validating the idea, it waits for v2.',
  },
  {
    question: 'Can you take over an existing codebase?',
    answer:
      'Yes. We do codebase audits, identify tech debt, and create a remediation plan. We can modernize incrementally while keeping the product running — no rewrite-from-scratch gambles.',
  },
  {
    question: 'How do you handle ongoing maintenance?',
    answer:
      'We offer retainer agreements for ongoing development and maintenance. Security patches, dependency updates, feature work, and on-call support — scoped to what you actually need.',
  },
  {
    question: 'What about the cemetery software project?',
    answer:
      'EternaGuard is our flagship case study — a full cemetery management platform with GPS navigation, AI maintenance detection, and drone monitoring. It demonstrates our full-stack capabilities on a complex, domain-specific problem.',
  },
];

const CASE_STUDY_SECTION = (
  <section className="py-16 md:py-24">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-6 text-center">
        Case Study: Cemetery Management Software
      </h2>
      <p className="text-lg text-[#00ff00]/80 mb-8 text-center max-w-3xl mx-auto">
        GPS grave navigation, AI maintenance detection, drone monitoring, and integrated business tools — built from scratch for an underserved industry.
      </p>
      <div className="flex justify-center">
        <Link
          href="/cemetery-software"
          className="px-8 py-4 border border-[#00ff00]/50 text-[#00ff00] font-bold rounded-lg hover:bg-[#00ff00]/10 transition-colors"
        >
          View Case Study &rarr;
        </Link>
      </div>
    </div>
  </section>
);

export default function CustomSaasContent() {
  return (
    <ServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Custom SaaS' },
      ]}
      heroTitle="Custom Software That Fits Your Business"
      heroSubtitle="Full-stack Next.js applications, cloud infrastructure, and MVPs built by an engineer who understands your domain — not an agency that outsources the work."
      heroImage="/images/services/custom-saas-hero.png"
      painPointsTitle="Why Off-the-Shelf Software Fails"
      painPoints={PAIN_POINTS}
      featuresTitle="What We Build"
      features={FEATURES}
      subServices={SUB_SERVICES}
      blogPosts={BLOG_POSTS}
      whyUs={WHY_US}
      faq={FAQ}
      contactTitle="Let's Build Something That Fits"
      contactSubtitle="Describe what you need and we'll scope it — no commitment, no sales pitch."
      extraSection={CASE_STUDY_SECTION}
    />
  );
}
