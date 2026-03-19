import { Cpu, Shield, Wrench } from 'lucide-react';

const differentiators = [
  {
    icon: Cpu,
    label: 'Engineer-Led',
    description: 'You talk directly to the person writing the code. No project managers, no offshore handoffs.',
  },
  {
    icon: Shield,
    label: 'You Own Everything',
    description: 'Every line of code, every deployment config, every database. No licensing traps.',
  },
  {
    icon: Wrench,
    label: 'Built to Maintain',
    description: 'Clean code, proper testing, and CI/CD from the start. Your next developer will thank you.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-[#00ff00]/60 text-center mb-3">
          The difference
        </p>
        <h2 className="text-2xl md:text-4xl font-bold mb-12 text-[#00ff00] text-center">
          Why CyberWorld Builders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="text-center border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors"
            >
              <item.icon className="w-10 h-10 mx-auto mb-4 text-[#00ff00]" />
              <div className="font-bold text-[#00ff00] mb-2">{item.label}</div>
              <div className="text-sm text-[#00ff00]/70 leading-relaxed">{item.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#00ff00]/60">
            CyberWorld Builders, Inc. &middot; Based in the USA, working with clients worldwide.
          </p>
        </div>
      </div>
    </section>
  );
}
