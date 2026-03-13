import { TrendingUp, Workflow, Code2 } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';

const services = [
  {
    href: '/services/digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Automated content pipelines, AI-powered SEO audits, and GEO optimization that keep your marketing running 24/7.',
    tags: ['SEO Audit', 'Content Pipeline', 'GEO Optimization'],
    image: '/images/services/digital-marketing-hero.png',
  },
  {
    href: '/services/automation',
    icon: Workflow,
    title: 'Automation',
    description: 'AI agents, n8n workflow orchestration, and chatbot development that eliminate manual work and connect your tools.',
    tags: ['AI Agents', 'n8n Workflows', 'AI Chatbots'],
    image: '/images/services/automation-hero.png',
  },
  {
    href: '/services/custom-saas',
    icon: Code2,
    title: 'Custom SaaS',
    description: 'Full-stack Next.js applications, cloud infrastructure, and MVP development built around your business.',
    tags: ['Next.js Apps', 'MVP Development', 'API Development'],
    image: '/images/services/custom-saas-hero.png',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
          What we build
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-[#00ff00]">
          Services
        </h2>
        <p className="text-center text-[#00ff00]/70 mb-12 max-w-2xl mx-auto">
          Systems that grow your business while freeing your team to do their best work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
