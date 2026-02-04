import { Cpu, Workflow, Code2, MessageSquare } from 'lucide-react';

const services = [
  {
    icon: Cpu,
    title: 'AI Automation Flows',
    description: 'Intelligent workflows that handle repetitive tasks, process data, and make decisions - so you can focus on growing your business.',
    examples: ['Lead qualification bots', 'Document processing', 'Email automation'],
  },
  {
    icon: Workflow,
    title: 'Custom Automation Solutions',
    description: 'Connect your existing tools and automate the gaps between them. No more manual data entry or copy-paste workflows.',
    examples: ['CRM integrations', 'Invoice processing', 'Scheduling automation'],
  },
  {
    icon: Code2,
    title: 'Web Applications',
    description: 'Modern, fast web apps built to your specifications. From internal tools to customer-facing platforms.',
    examples: ['Customer portals', 'Booking systems', 'Admin dashboards'],
  },
  {
    icon: MessageSquare,
    title: 'Technical Consulting',
    description: 'Not sure where to start? Get expert guidance on your technology stack, automation strategy, or digital transformation.',
    examples: ['Tech audits', 'Stack recommendations', 'Roadmap planning'],
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#00ff00]">
          Services
        </h2>
        <p className="text-center text-[#00ff00]/70 mb-12 max-w-2xl mx-auto">
          Practical solutions for businesses that want to work smarter, not harder.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
