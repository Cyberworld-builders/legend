import Link from 'next/link';
import { TrendingUp, Workflow, Code2 } from 'lucide-react';

const services = [
  {
    href: '/services/digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Automated content pipelines, AI-powered SEO audits, and GEO optimization that keep your marketing running 24/7.',
    examples: ['SEO Audit', 'Content Pipeline', 'GEO Optimization'],
  },
  {
    href: '/services/automation',
    icon: Workflow,
    title: 'Automation',
    description: 'AI agents, n8n workflow orchestration, and chatbot development that eliminate manual work and connect your tools.',
    examples: ['AI Agents', 'n8n Workflows', 'AI Chatbots'],
  },
  {
    href: '/services/custom-saas',
    icon: Code2,
    title: 'Custom SaaS',
    description: 'Full-stack Next.js applications, cloud infrastructure, and MVP development built around your business.',
    examples: ['Next.js Apps', 'MVP Development', 'API Development'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#00ff00]">
          Services
        </h2>
        <p className="text-center text-[#00ff00]/70 mb-12 max-w-2xl mx-auto">
          Systems that grow your business while freeing your team to do their best work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="block p-6 border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 transition-colors bg-[#1a1a1a] group"
            >
              <service.icon className="w-10 h-10 text-[#00ff00] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#00ff00]">{service.title}</h3>
              <p className="text-[#00ff00]/70 mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {service.examples.map((example, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-[#00ff00]/10 border border-[#00ff00]/20 rounded text-[#00ff00]/80"
                  >
                    {example}
                  </span>
                ))}
              </div>
              <span className="text-sm text-[#00ff00]/50 group-hover:text-[#00ff00]/80 transition-colors">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
