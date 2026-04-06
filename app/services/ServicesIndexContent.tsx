'use client';

import dynamic from 'next/dynamic';
import { TrendingUp, Workflow, Code2 } from 'lucide-react';
import PageBackground from '@/components/PageBackground';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceCard from '@/components/ServiceCard';

const ScrollTracker = dynamic(() => import('@/components/ScrollTracker'), {
  ssr: false,
});

const SERVICES = [
  {
    href: '/services/digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing & SEO',
    description:
      'Automated SEO audits, content pipelines, and generative engine optimization (GEO) that keep your site visible to both search engines and AI platforms.',
    tags: ['SEO Audit', 'Content Pipeline', 'GEO Optimization', 'AI Search Readiness'],
    image: '/images/services/digital-marketing-hero.png',
  },
  {
    href: '/services/automation',
    icon: Workflow,
    title: 'Custom AI Agents',
    description:
      'Purpose-built AI agents that take action on your behalf. From autonomous workflows to API integrations, code-first automation that goes beyond chatbots and visual tools.',
    tags: ['AI Agent Development', 'API Integration', 'Claude Integration', 'Autonomous Workflows'],
    image: '/images/services/automation-hero.png',
  },
  {
    href: '/services/custom-saas',
    icon: Code2,
    title: 'Custom SaaS & MVPs',
    description:
      'Full-stack Next.js + Supabase applications with CI/CD, cloud infrastructure on AWS, and production-ready MVP development.',
    tags: ['Next.js Apps', 'MVP Development', 'Supabase', 'AWS & DevOps'],
    image: '/images/services/custom-saas-hero.png',
  },
];

export default function ServicesIndexContent() {
  return (
    <div className="relative min-h-screen">
      <PageBackground opacity={15} fullWidth={true} />
      <ScrollTracker sections={['hero', 'services', 'cta']} />

      <main className="relative z-10">
        <section id="hero" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services' },
              ]}
            />
            <h1 className="text-3xl md:text-5xl font-bold text-[#00ff00] mb-6 leading-tight">
              What We Build
            </h1>
            <p className="text-lg md:text-xl text-[#00ff00]/80 max-w-3xl">
              Systems that grow your business while freeing your team to do their best work.
              Three disciplines, one engineering team.
            </p>
          </div>
        </section>

        <section id="services" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <ServiceCard key={service.href} {...service} priority />
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-[#00ff00]/80 mb-8 max-w-2xl mx-auto">
              Tell us what you&apos;re trying to solve. We&apos;ll figure out which combination
              of services gets you there fastest.
            </p>
            <a
              href="mailto:contact@cyberworldbuilders.com"
              className="inline-block px-8 py-4 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors text-lg"
            >
              Start a Conversation
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
