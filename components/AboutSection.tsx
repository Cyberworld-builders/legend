import { Award, Cloud, Code, Zap } from 'lucide-react';

const highlights = [
  { icon: Cloud, label: 'AWS Solutions', description: 'Cloud infrastructure & serverless' },
  { icon: Code, label: '10+ Years Dev', description: 'Full-stack web development' },
  { icon: Zap, label: 'Automation Expert', description: 'n8n, Make.com, custom flows' },
  { icon: Award, label: 'Certified Pro', description: 'AWS & modern tech stacks' },
];

export default function AboutSection() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00ff00]">
            About Jay
          </h2>
          <p className="text-[#00ff00]/70 max-w-2xl mx-auto">
            I&apos;m a software engineer who&apos;s been building web applications and
            automation systems for over a decade. I work with small businesses
            to identify bottlenecks and build solutions that actually get used.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="text-center p-4 border border-[#00ff00]/10 rounded-lg"
            >
              <item.icon className="w-8 h-8 mx-auto mb-2 text-[#00ff00]" />
              <div className="font-semibold text-sm text-[#00ff00]">{item.label}</div>
              <div className="text-xs text-[#00ff00]/50">{item.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#00ff00]/70 mb-2">
            Based in the USA. Working with clients worldwide.
          </p>
          <p className="text-sm text-[#00ff00]/50">
            CyberWorld Builders, Inc.
          </p>
        </div>
      </div>
    </section>
  );
}
