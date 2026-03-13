'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  FileWarning,
  Footprints,
  MapPinOff,
  Unplug,
  MapPin,
  Brain,
  Plane,
  ClipboardList,
  Search,
  Briefcase,
  Shield,
  Cpu,
  Wrench,
} from 'lucide-react';
import PageBackground from '@/components/PageBackground';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';
import TurnstileField from '@/components/TurnstileField';
import { trackEvent } from '@/lib/tracking';

const ScrollTracker = dynamic(() => import('@/components/ScrollTracker'), {
  ssr: false,
});

const TRACKED_SECTIONS = [
  'hero',
  'problem',
  'features',
  'demo',
  'why-us',
  'faq',
  'contact',
];

const PAIN_POINTS = [
  {
    icon: FileWarning,
    title: 'Paper Records & Manual Systems',
    description:
      'Plot maps in filing cabinets, handwritten burial records, and spreadsheets that only one person understands. One retirement or hard drive crash away from disaster.',
  },
  {
    icon: Footprints,
    title: 'Reactive Maintenance',
    description:
      'Walking the grounds to find problems instead of preventing them. Sunken markers, overgrown plots, and damaged headstones discovered by families, not staff.',
  },
  {
    icon: MapPinOff,
    title: 'Poor Navigation',
    description:
      'Visitors drive around lost looking for a grave. Staff field phone calls giving directions by landmark. No digital wayfinding exists.',
  },
  {
    icon: Unplug,
    title: 'Disconnected Tools',
    description:
      'CRM, CMS, work orders, and billing in separate systems that don\'t talk to each other. Data re-entered three times across three platforms.',
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: 'GPS Plot Navigation',
    description:
      'Turn-by-turn directions to any grave. Families search by name and get guided right to the plot on their phone.',
  },
  {
    icon: Brain,
    title: 'AI Maintenance Detection',
    description:
      'Computer vision identifies sunken markers, damaged headstones, and overgrown plots from photos and drone footage automatically.',
  },
  {
    icon: Plane,
    title: 'Drone Monitoring',
    description:
      'Scheduled drone flyovers generate high-resolution aerial maps. AI analyzes changes between flights to flag maintenance needs.',
  },
  {
    icon: ClipboardList,
    title: 'Smart Task Management',
    description:
      'Maintenance tasks auto-generated from AI detections. Assign, prioritize, and track work orders with photo documentation.',
  },
  {
    icon: Search,
    title: 'Natural Language Search',
    description:
      'Vector database with RAG-powered search. Ask "show me all veterans buried in section C" and get instant, accurate results.',
  },
  {
    icon: Briefcase,
    title: 'Business Suite',
    description:
      'CMS for your public-facing site, CRM for family relationships, and work order management — all in one integrated platform.',
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Industry Knowledge',
    description:
      'We\'ve studied the death care industry deeply — from municipal cemeteries to private memorial parks. The software reflects real operational needs, not guesses.',
  },
  {
    icon: Cpu,
    title: 'Modern Tech Stack',
    description:
      'Built with the same tools used by top tech companies: Next.js, React, cloud infrastructure, AI/ML pipelines. Enterprise-grade reliability without enterprise pricing.',
  },
  {
    icon: Wrench,
    title: 'Custom-Built, Not Off-the-Shelf',
    description:
      'No forcing your operations into someone else\'s workflow. Every feature is built around how cemeteries actually work, with room to adapt as your needs evolve.',
  },
];

const FAQ_DATA = [
  {
    question: 'What types of cemeteries does this software support?',
    answer:
      'Municipal cemeteries, private memorial parks, church cemeteries, veterans cemeteries, and multi-site cemetery networks. The platform adapts to your size and structure — whether you manage 500 plots or 50,000.',
  },
  {
    question: 'How does the GPS plot navigation work?',
    answer:
      'Every plot is geocoded with precise coordinates. Visitors search by name on their phone and get walking or driving directions directly to the gravesite. Staff can also use GPS for plot verification during burials and maintenance.',
  },
  {
    question: 'Are drones required to use the software?',
    answer:
      'No. Drone monitoring is an optional module. The core platform — GPS navigation, record management, work orders, and search — works without any drone hardware. Drones add aerial monitoring and automated change detection when you\'re ready.',
  },
  {
    question: 'Can it integrate with our existing systems?',
    answer:
      'Yes. We build custom integrations with existing CRM, accounting, and municipal record systems. If your current software has an API or exportable data, we can connect it.',
  },
  {
    question: 'How long does implementation take?',
    answer:
      'A core deployment (GPS navigation, record management, search) typically takes 4-8 weeks. Full platform rollout with AI maintenance detection and drone integration is 8-12 weeks. We work iteratively — you see working software every week.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing depends on cemetery size, number of plots, and which modules you need. We provide transparent, itemized quotes after an initial discovery call. No hidden fees, no per-seat licensing traps.',
  },
  {
    question: 'Can I see a working demo?',
    answer:
      'Yes. EternaGuard is a fully functional demo you can explore right now. It shows GPS navigation, plot management, and the maintenance workflow in action with sample data.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function CemeteryContent() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [openFaqItems, setOpenFaqItems] = useState<Set<number>>(new Set());

  const handleTurnstileVerify = useCallback(
    (token: string) => setTurnstileToken(token),
    []
  );
  const handleTurnstileExpire = useCallback(
    () => setTurnstileToken(null),
    []
  );

  const needsTurnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const canSubmit = !needsTurnstile || turnstileToken;

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setEmailError('');

    trackEvent('cta_click', { cta: 'cemetery_hero_email' });

    try {
      const payload: Record<string, unknown> = { email };
      if (turnstileToken) payload.turnstileToken = turnstileToken;

      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      setEmail('');
      trackEvent('lead_submit', { cta: 'cemetery_hero_email' });
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    const next = new Set(openFaqItems);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setOpenFaqItems(next);
  };

  return (
    <div className="relative min-h-screen">
      <PageBackground opacity={15} fullWidth={true} />
      <ScrollTracker sections={TRACKED_SECTIONS} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="relative z-10">
        {/* Hero */}
        <section id="hero" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Cemetery Software' },
              ]}
            />

            <h1 className="text-3xl md:text-5xl font-bold text-[#00ff00] mb-6 leading-tight">
              Cemetery Management Software Built for the Modern Death Care
              Industry
            </h1>

            <p className="text-lg md:text-xl text-[#00ff00]/80 mb-8 max-w-3xl">
              GPS-guided grave navigation, AI-powered maintenance detection,
              drone monitoring, and integrated business tools — custom-built
              for how cemeteries actually operate.
            </p>

            <div className="max-w-md mx-auto mb-6">
              {submitted ? (
                <div className="text-[#00ff00] font-semibold py-3">
                  Thanks! We&apos;ll be in touch soon.
                </div>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col gap-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email address"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                      className="px-6 py-3 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSubmitting ? '...' : "Let's Talk"}
                    </button>
                  </div>
                  <TurnstileField
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                  />
                </form>
              )}
              {emailError && (
                <p className="text-red-400 text-sm mt-2">{emailError}</p>
              )}
            </div>

            <p className="text-sm text-[#00ff00]/60">
              Working demo available &bull; Built by engineers, not salespeople
            </p>
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Cemetery Operations Are Stuck in the Last Century
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PAIN_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors"
                >
                  <point.icon className="w-8 h-8 text-[#00ff00] mb-4" />
                  <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-[#00ff00]/70 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              What Modern Cemetery Software Looks Like
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-[#00ff00] mb-4" />
                  <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#00ff00]/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section id="demo" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-6">
              See It In Action
            </h2>

            <p className="text-lg text-[#00ff00]/80 mb-8 max-w-2xl mx-auto">
              EternaGuard is our working cemetery management demo — GPS
              navigation, plot management, and maintenance workflows with
              real sample data. No signup required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://eternaguard.cyberworldbuilders.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('cta_click', { cta: 'cemetery_demo' })
                }
                className="px-8 py-4 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors text-lg"
              >
                Launch Demo
              </a>
              <Link
                href="/blog/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes"
                className="px-8 py-4 border border-[#00ff00]/50 text-[#00ff00] font-bold rounded-lg hover:bg-[#00ff00]/10 transition-colors"
              >
                Read the Deep Dive
              </Link>
            </div>
          </div>
        </section>

        {/* Why CyberWorld */}
        <section id="why-us" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Why CyberWorld Builders
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_US.map((item) => (
                <div
                  key={item.title}
                  className="border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors text-center"
                >
                  <item.icon className="w-10 h-10 text-[#00ff00] mb-4 mx-auto" />
                  <h3 className="text-lg font-bold text-[#00ff00] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#00ff00]/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {FAQ_DATA.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#00ff00]/30 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors flex justify-between items-center"
                    aria-expanded={openFaqItems.has(index)}
                  >
                    <span className="text-lg font-semibold text-[#00ff00] pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#00ff00] transition-transform duration-200 flex-shrink-0 ${
                        openFaqItems.has(index) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openFaqItems.has(index) && (
                    <div className="px-6 py-4 bg-[#2a2a2a] border-t border-[#00ff00]/20">
                      <p className="text-[#00ff00]/90 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-4 text-center">
              Let&apos;s Talk About Your Cemetery
            </h2>
            <p className="text-[#00ff00]/70 text-center mb-8">
              Tell us about your operation and we&apos;ll show you what&apos;s
              possible.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}
