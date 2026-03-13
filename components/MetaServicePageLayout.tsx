'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { LucideIcon, ArrowRight } from 'lucide-react';
import PageBackground from '@/components/PageBackground';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';

const ScrollTracker = dynamic(() => import('@/components/ScrollTracker'), {
  ssr: false,
});

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

interface ContentLink {
  title: string;
  href: string;
  image?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface MetaServicePageLayoutProps {
  breadcrumbItems: BreadcrumbItem[];
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  capabilitiesTitle: string;
  capabilities: Capability[];
  stepsTitle: string;
  steps: Step[];
  blogPosts: ContentLink[];
  crossLinks: ContentLink[];
  faq: FaqItem[];
  contactTitle: string;
  contactSubtitle: string;
}

const TRACKED_SECTIONS = [
  'hero',
  'capabilities',
  'process',
  'related',
  'faq',
  'contact',
];

function ScanlineDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent" />
    </div>
  );
}

export default function MetaServicePageLayout({
  breadcrumbItems,
  heroTitle,
  heroSubtitle,
  heroImage,
  capabilitiesTitle,
  capabilities,
  stepsTitle,
  steps,
  blogPosts,
  crossLinks,
  faq,
  contactTitle,
  contactSubtitle,
}: MetaServicePageLayoutProps) {
  const [openFaqItems, setOpenFaqItems] = useState<Set<number>>(new Set());

  const toggleFaq = (index: number) => {
    const next = new Set(openFaqItems);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setOpenFaqItems(next);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
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
        {/* Hero — image as atmospheric backdrop */}
        <section id="hero" className="relative overflow-hidden">
          {heroImage && (
            <div className="absolute inset-0">
              <Image
                src={heroImage}
                alt=""
                fill
                className="object-cover opacity-50"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-[#1a1a1a]/20" />
              <div className="absolute inset-0 bg-[#00ff00]/[0.03]" />
            </div>
          )}

          <div className="relative z-10 py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4">
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="text-3xl md:text-5xl font-bold text-[#00ff00] mb-6 leading-[1.1] tracking-tight">
                {heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-[#00ff00]/70 mb-10 max-w-2xl leading-relaxed">
                {heroSubtitle}
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-6 py-3 border border-[#00ff00]/50 rounded text-[#00ff00] hover:bg-[#00ff00]/10 transition-all duration-200 text-base"
              >
                <span className="text-[#00ff00]/50 select-none">$</span>
                <span className="font-bold">get-started</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </a>
            </div>
          </div>
        </section>

        <div className="h-12 md:h-20" />
        <ScanlineDivider />

        {/* Capabilities */}
        <section id="capabilities" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              What we deliver
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              {capabilitiesTitle}
            </h2>
            <div className={`grid grid-cols-1 ${capabilities.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors"
                >
                  <cap.icon className="w-8 h-8 text-[#00ff00] mb-4" />
                  <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-[#00ff00]/70 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ScanlineDivider />

        {/* How It Works */}
        <section id="process" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              The process
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              {stepsTitle}
            </h2>
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[#00ff00] flex items-center justify-center text-[#00ff00] font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px h-full bg-[#00ff00]/20 my-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#00ff00]/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ScanlineDivider />

        {/* Related Content */}
        <section id="related" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              Go deeper
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Related Content
            </h2>

            {blogPosts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#00ff00] mb-6">From Our Blog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.href}
                      href={post.href}
                      className="group block border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 transition-colors bg-[#1a1a1a] overflow-hidden"
                    >
                      {post.image && (
                        <div className="relative overflow-hidden h-36">
                          <Image
                            src={post.image}
                            alt=""
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-[#00ff00] font-semibold">
                          {post.title}
                        </span>
                        <span className="block text-sm text-[#00ff00]/50 group-hover:text-[#00ff00]/80 transition-colors mt-1">
                          Read article &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-[#00ff00] mb-6">Explore More Services</h3>
              <div className="flex flex-wrap gap-3">
                {crossLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/10 transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ScanlineDivider />

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#00ff00]/20 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 transition-colors flex justify-between items-center"
                    aria-expanded={openFaqItems.has(index)}
                  >
                    <span className="text-base font-semibold text-[#00ff00] pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#00ff00]/50 transition-transform duration-200 flex-shrink-0 ${
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
                    <div className="px-6 py-4 border-t border-[#00ff00]/10">
                      <p className="text-[#00ff00]/70 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <ScanlineDivider />

        {/* Contact */}
        <section id="contact" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-4 text-center">
              {contactTitle}
            </h2>
            <p className="text-[#00ff00]/70 text-center mb-8">
              {contactSubtitle}
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}
