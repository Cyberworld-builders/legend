'use client';

import React from 'react';

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

export default function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  );
}
