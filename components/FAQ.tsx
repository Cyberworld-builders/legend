'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What services does CyberWorld Builders offer?",
    answer: "We specialize in software engineering, web development, AWS solutions, and SaaS development. Our services include custom application development, cloud infrastructure setup, database design, API development, and technical consulting for modern web technologies."
  },
  {
    question: "What technologies do you work with?",
    answer: "We work with modern web technologies including Next.js, React, TypeScript, Node.js, PostgreSQL, Supabase, AWS, Stripe, and various AI/automation tools. We stay current with the latest frameworks and best practices in software development."
  },
  {
    question: "Do you work with startups or established companies?",
    answer: "We work with both startups and established companies. For startups, we help build MVPs and scale technical infrastructure. For established companies, we provide consulting, system optimization, and integration of new technologies."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary based on scope and complexity. Simple websites can take 2-4 weeks, while complex SaaS applications may take 3-6 months. We provide detailed project estimates during our initial consultation and maintain regular communication throughout development."
  },
  {
    question: "Do you provide ongoing maintenance and support?",
    answer: "Yes, we offer ongoing maintenance, monitoring, and support services. This includes bug fixes, security updates, performance optimization, and feature enhancements. We can also provide technical consulting for scaling and optimization."
  },
  {
    question: "How do you ensure code quality and security?",
    answer: "We follow industry best practices including code reviews, automated testing, security audits, and documentation. We use modern development tools, implement proper error handling, and follow OWASP security guidelines to ensure robust and secure applications."
  },
  {
    question: "Can you help with existing projects or only new development?",
    answer: "We work with both new and existing projects. For existing projects, we can help with debugging, refactoring, adding new features, performance optimization, or migrating to modern technologies. We start with a thorough code review to understand the current state."
  },
  {
    question: "What is your pricing model?",
    answer: "We offer flexible pricing models including hourly rates, fixed-price projects, and retainer agreements. Pricing depends on project complexity, timeline, and specific requirements. We provide transparent estimates and can work within various budget constraints."
  },
  {
    question: "How do you handle project communication and updates?",
    answer: "We maintain regular communication through your preferred channels (email, Slack, etc.) and provide weekly progress updates. We use project management tools to track milestones and ensure you're always informed about project status and any potential issues."
  },
  {
    question: "Do you offer training or knowledge transfer?",
    answer: "Yes, we provide comprehensive documentation and can conduct training sessions for your team. We believe in knowledge transfer and can help your internal team understand the systems we build, including code walkthroughs and best practices training."
  }
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
    <div className="w-full max-w-4xl mx-auto">
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
        <p className="text-[#00ff00]/70 mb-4">
          Don&apos;t see your question? We&apos;re here to help!
        </p>
        <a
          href="mailto:contact@cyberworldbuilders.com"
          className="inline-block px-6 py-3 bg-[#00ff00] text-[#1a1a1a] font-semibold rounded-lg hover:bg-[#00cc00] transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
