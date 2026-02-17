import { Briefcase } from 'lucide-react';

export default function ProofSection() {
  return (
    <section id="proof" className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#00ff00]">
          Recent Work
        </h2>
        <p className="text-center text-[#00ff00]/70 mb-8 max-w-2xl mx-auto">
          Active projects and results from current engagements.
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-start gap-4 p-5 border border-[#00ff00]/20 rounded-lg bg-[#1a1a1a]">
            <Briefcase className="w-6 h-6 text-[#00ff00] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-[#00ff00] mb-1">
                Digital Marketing System for a Service Business
              </h3>
              <p className="text-sm text-[#00ff00]/70">
                Building automated lead capture, local SEO optimization, and
                performance reporting for a growing service-industry company.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[#00ff00]/50 pt-2">
            Case studies with detailed results coming Q2 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
