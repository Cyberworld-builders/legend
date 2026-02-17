import { TrendingUp, Workflow, Code2 } from 'lucide-react';

const services = [
  {
    icon: TrendingUp,
    title: 'Digital Marketing Systems',
    description: 'Automated lead capture, content pipelines, and reporting dashboards that keep your marketing running 24/7.',
    examples: ['Lead generation', 'Content automation', 'Analytics dashboards'],
  },
  {
    icon: Workflow,
    title: 'Business Process Automation',
    description: 'Connect your tools, eliminate manual data entry, and let your team focus on high-value work.',
    examples: ['CRM integrations', 'Invoice processing', 'Scheduling'],
  },
  {
    icon: Code2,
    title: 'Software Engineering',
    description: 'Web applications, cloud infrastructure, and SaaS products built with modern tech stacks.',
    examples: ['Next.js / React', 'AWS & cloud', 'API development'],
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
            <div
              key={index}
              className="p-6 border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 transition-colors bg-[#1a1a1a]"
            >
              <service.icon className="w-10 h-10 text-[#00ff00] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#00ff00]">{service.title}</h3>
              <p className="text-[#00ff00]/70 mb-4">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.examples.map((example, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-[#00ff00]/10 border border-[#00ff00]/20 rounded text-[#00ff00]/80"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
