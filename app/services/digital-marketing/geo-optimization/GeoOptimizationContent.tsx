'use client';

import {
  HelpCircle,
  Quote,
  UserCheck,
  Bot,
  Search,
  Wrench,
  Activity,
  RefreshCw,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: HelpCircle,
    title: 'Question-Based Headers',
    description:
      'Restructure content with question-format headings that match how AI systems parse and retrieve information.',
  },
  {
    icon: Quote,
    title: 'Citation Density',
    description:
      'Increase the density of citable facts, statistics, and authoritative claims that AI systems prefer to reference.',
  },
  {
    icon: UserCheck,
    title: 'E-E-A-T Signals',
    description:
      'Strengthen Experience, Expertise, Authoritativeness, and Trustworthiness signals that both Google and AI engines weigh.',
  },
  {
    icon: Bot,
    title: 'AI Crawler Access',
    description:
      'Ensure your content is accessible to GPTBot, ClaudeBot, and other AI crawlers. Proper robots.txt, structured data, and clean HTML.',
  },
];

const STEPS = [
  {
    title: 'Audit',
    description:
      'We scan your existing content for GEO readiness — question headers, citation density, freshness signals, author attribution, FAQ depth, heading hierarchy, and AI crawler access.',
  },
  {
    title: 'Implement',
    description:
      'Restructure existing content and create new pages optimized for AI citation. Add schema markup, improve heading structure, and strengthen E-E-A-T signals.',
  },
  {
    title: 'Monitor',
    description:
      'Track your content\'s appearance in AI-generated responses across ChatGPT, Perplexity, and Google AI Overviews. Measure citation frequency and context.',
  },
  {
    title: 'Iterate',
    description:
      'Refine content based on what\'s getting cited and what\'s not. GEO is an evolving practice — we adapt as AI search engines evolve.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Enhancing SEO on My Company Landing Site with AI Agents',
    href: '/blog/enhancing-seo-on-my-company-landing-site-with-ai-agents',
    image: '/images/enhancing-seo-on-my-company-landing-site-with-ai-agents-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'SEO Audit', href: '/services/digital-marketing/seo-audit' },
  { title: 'Content Pipeline', href: '/services/digital-marketing/content-pipeline' },
  { title: 'Digital Marketing', href: '/services/digital-marketing' },
];

const FAQ = [
  {
    question: 'What is Generative Engine Optimization (GEO)?',
    answer:
      'GEO is the practice of optimizing your content to be cited by AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. It builds on traditional SEO but focuses on how AI systems select and present information.',
  },
  {
    question: 'Does GEO replace traditional SEO?',
    answer:
      'No — GEO complements it. Traditional SEO gets you ranked in search results. GEO gets you cited in AI responses. Both drive traffic, and most GEO improvements also help traditional SEO rankings.',
  },
  {
    question: 'How do you measure GEO success?',
    answer:
      'We track citation appearances in AI responses, referral traffic from AI platforms, GEO audit scores over time, and the specific queries where your content gets cited.',
  },
  {
    question: 'How long before we see results?',
    answer:
      'AI search engines re-crawl and update their knowledge bases on varying schedules. Structural improvements (headers, schema, crawler access) can show impact within 2-4 weeks. Content-level improvements typically take 4-8 weeks.',
  },
];

export default function GeoOptimizationContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'GEO Optimization' },
      ]}
      heroTitle="Get Cited by AI Search Engines"
      heroSubtitle="Generative Engine Optimization puts your content in front of ChatGPT, Perplexity, and Google AI Overviews — where your customers are increasingly searching."
      heroImage="/images/services/geo-optimization-hero.png"
      capabilitiesTitle="What We Do"
      capabilities={CAPABILITIES}
      stepsTitle="How It Works"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready for AI Search?"
      contactSubtitle="Let's audit your content and build a GEO strategy."
    />
  );
}
