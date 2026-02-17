'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What kind of businesses do you work with?",
    answer: "Primarily service businesses — plumbers, contractors, agencies, and regional companies that are growing but still running marketing manually. If you're spending hours on tasks that should be automated, we can help."
  },
  {
    question: "What does a digital marketing system include?",
    answer: "It depends on your needs, but typically: automated lead capture forms, email nurture sequences, content scheduling, SEO monitoring, and a reporting dashboard so you can see what's working. Everything is built to run without daily babysitting."
  },
  {
    question: "Do you also build software and web apps?",
    answer: "Yes. I've been building web applications and cloud infrastructure for over a decade — Next.js, React, AWS, APIs, the works. If you need a custom tool, portal, or SaaS product, that's in my wheelhouse too."
  },
  {
    question: "How does a typical engagement start?",
    answer: "We start with a short discovery call to understand your business and goals. From there I'll propose a scope, timeline, and price. If it makes sense for both of us, we build iteratively — you see progress every week, not just at the end."
  },
  {
    question: "What does it cost?",
    answer: "It varies by scope. A focused marketing automation project might be a few thousand dollars; a full custom web application is more. I provide transparent, itemized estimates before any work begins, and I offer flexible pricing models including hourly and fixed-price."
  },
  {
    question: "How long until I see results?",
    answer: "Most clients have a working system within 2-4 weeks. Measurable improvements in lead flow and marketing efficiency typically show up within 30-60 days. I prioritize shipping something useful fast, then iterating."
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div id="faq" className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-[#00ff00] text-center">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-[#00ff00]/30 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors flex justify-between items-center"
              aria-expanded={openItems.has(index)}
            >
              <span className="text-lg font-semibold text-[#00ff00] pr-4">
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 text-[#00ff00] transition-transform duration-200 ${
                  openItems.has(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openItems.has(index) && (
              <div className="px-6 py-4 bg-[#2a2a2a] border-t border-[#00ff00]/20">
                <p className="text-[#00ff00]/90 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-3 border border-[#00ff00]/50 text-[#00ff00]/70 font-bold rounded-lg hover:bg-[#00ff00]/10 transition-colors"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
