'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import PageBackground from '@/components/PageBackground';
import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/ContactForm';
import ServiceCard from '@/components/ServiceCard';

const ScrollTracker = dynamic(() => import('@/components/ScrollTracker'), {
  ssr: false,
});

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface IconItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SubService {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

interface BlogLink {
  title: string;
  href: string;
  image?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ServicePageLayoutProps {
  breadcrumbItems: BreadcrumbItem[];
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  painPointsTitle: string;
  painPoints: IconItem[];
  featuresTitle: string;
  features: IconItem[];
  subServices: SubService[];
  blogPosts: BlogLink[];
  whyUs: IconItem[];
  faq: FaqItem[];
  contactTitle: string;
  contactSubtitle: string;
  extraSection?: React.ReactNode;
}

const TRACKED_SECTIONS = [
  'hero',
  'pain-points',
  'features',
  'sub-services',
  'blog-posts',
  'why-us',
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

export default function ServicePageLayout({
  breadcrumbItems,
  heroTitle,
  heroSubtitle,
  heroImage,
  painPointsTitle,
  painPoints,
  featuresTitle,
  features,
  subServices,
  blogPosts,
  whyUs,
  faq,
  contactTitle,
  contactSubtitle,
  extraSection,
}: ServicePageLayoutProps) {
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
              <img
                src={heroImage}
                alt=""
                className="w-full h-full object-cover opacity-50"
                loading="eager"
              />
              {/* Bottom fade to content */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-[#1a1a1a]/20" />
              {/* Subtle green tint overlay */}
              <div className="absolute inset-0 bg-[#00ff00]/[0.03]" />
            </div>
          )}

          <div className="relative z-10 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-4">
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#00ff00] mb-6 leading-[1.1] tracking-tight">
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

        {/* Pain Points — amber-tinted to signal "problem" */}
        <section id="pain-points" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              The problem
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              {painPointsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {painPoints.map((point) => (
                <div
                  key={point.title}
                  className="border border-[#ff9900]/15 rounded-lg p-6 hover:border-[#ff9900]/30 transition-colors bg-[#ff9900]/[0.03]"
                >
                  <point.icon className="w-8 h-8 text-[#ff9900]/70 mb-4" />
                  <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-[#00ff00]/60 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ScanlineDivider />

        {/* Features — green solution cards */}
        <section id="features" className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              The solution
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              {featuresTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
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

        <ScanlineDivider />

        {/* Sub-Services */}
        <section id="sub-services" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
              Go deeper
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subServices.map((service) => (
                <ServiceCard key={service.href} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Extra section (e.g. case study) */}
        {extraSection && (
          <>
            <ScanlineDivider />
            {extraSection}
          </>
        )}

        {/* Related Blog Posts */}
        {blogPosts.length > 0 && (
          <>
            <ScanlineDivider />
            <section id="blog-posts" className="py-16 md:py-24">
              <div className="max-w-4xl mx-auto px-4">
                <p className="text-sm uppercase tracking-widest text-[#00ff00]/40 text-center mb-3">
                  Proof of work
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
                  From Our Blog
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.href}
                      href={post.href}
                      className="group block border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 transition-colors bg-[#1a1a1a] overflow-hidden"
                    >
                      {post.image && (
                        <div className="overflow-hidden">
                          <img
                            src={post.image}
                            alt=""
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#00ff00] mb-2">
                          {post.title}
                        </h3>
                        <span className="text-sm text-[#00ff00]/50 group-hover:text-[#00ff00]/80 transition-colors">
                          Read article &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <ScanlineDivider />

        {/* Why CyberWorld */}
        <section id="why-us" className="py-16 md:py-24 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00ff00] mb-12 text-center">
              Why CyberWorld Builders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyUs.map((item) => (
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
