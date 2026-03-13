'use client';

import {
  FileText,
  EyeOff,
  BarChart3,
  Bot,
  Newspaper,
  Search,
  LayoutDashboard,
  Globe,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import ServicePageLayout from '@/components/ServicePageLayout';

const PAIN_POINTS = [
  {
    icon: FileText,
    title: 'Manual Content Publishing',
    description:
      'Writing, formatting, and posting content by hand across multiple platforms. Hours spent on repetitive tasks that should be automated.',
  },
  {
    icon: EyeOff,
    title: 'Blind SEO',
    description:
      'No visibility into what\'s broken, what\'s ranking, or what to fix next. SEO audits happen once a year — if at all.',
  },
  {
    icon: BarChart3,
    title: 'Scattered Analytics',
    description:
      'Google Analytics in one tab, social metrics in another, email stats somewhere else. No unified view of what\'s actually working.',
  },
  {
    icon: Bot,
    title: 'Invisible to AI Search',
    description:
      'Your content doesn\'t show up in ChatGPT, Perplexity, or Google AI Overviews. Traditional SEO alone isn\'t enough anymore.',
  },
];

const FEATURES = [
  {
    icon: Newspaper,
    title: 'Automated Content Pipelines',
    description:
      'Voice memos and transcripts become published blog posts with hero images, social copy, and cross-platform distribution — automatically.',
  },
  {
    icon: Search,
    title: 'AI-Powered SEO Audit',
    description:
      'Continuous crawling, scoring, and auto-fixing of technical SEO issues. Problems get caught and resolved before they cost you rankings.',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboards',
    description:
      'Traffic, social engagement, and content performance in one place. See what\'s working at a glance instead of juggling five different tools.',
  },
  {
    icon: Globe,
    title: 'GEO Optimization',
    description:
      'Structured content for AI search engines — question-based headers, citation density, E-E-A-T signals, and AI crawler access baked into every page.',
  },
];

const SUB_SERVICES = [
  {
    href: '/services/digital-marketing/geo-optimization',
    icon: Globe,
    title: 'GEO Optimization',
    description:
      'Get your content cited by ChatGPT, Perplexity, and Google AI Overviews with generative engine optimization.',
    tags: ['AI Search', 'Citations', 'E-E-A-T'],
  },
  {
    href: '/services/digital-marketing/seo-audit',
    icon: Search,
    title: 'SEO Audit',
    description:
      'Automated technical SEO audits that find issues, score severity, and auto-fix what can be fixed — continuously.',
    tags: ['Technical SEO', 'Auto-Fix', 'Monitoring'],
  },
  {
    href: '/services/digital-marketing/content-pipeline',
    icon: Newspaper,
    title: 'Content Pipeline',
    description:
      'From voice memo to published blog post with hero images, social copy, and distribution — hands-free.',
    tags: ['Blog Automation', 'Social Distribution', 'AI Editing'],
  },
];

const BLOG_POSTS = [
  {
    title: 'Everything Compounds Now',
    href: '/blog/everything-compounds-now',
    image: '/images/everything-compounds-now-hero.png',
  },
  {
    title: 'One Week with Claude Code: The Publishing Pipeline',
    href: '/blog/one-week-claude-code-publishing-pipeline',
    image: '/images/one-week-claude-code-publishing-pipeline-hero.png',
  },
];

const WHY_US = [
  {
    icon: Sparkles,
    title: 'We Use What We Sell',
    description:
      'Our own blog runs on the same automated content pipeline we build for clients. 37 posts and counting — all published through the system.',
  },
  {
    icon: Target,
    title: 'SEO + Engineering',
    description:
      'Most agencies outsource the technical work. We build the tools ourselves — from crawlers to dashboards to auto-fixers.',
  },
  {
    icon: TrendingUp,
    title: 'Measurable Results',
    description:
      'Every system we build ships with analytics. You see exactly what it\'s doing for your traffic, rankings, and lead flow.',
  },
];

const FAQ = [
  {
    question: 'What does "automated content pipeline" mean?',
    answer:
      'You record a voice memo or paste a transcript. Our system classifies it, runs it through an AI editing pipeline that preserves your voice, generates a hero image, creates social media copy, and publishes it as a blog post — all without you touching a CMS.',
  },
  {
    question: 'How is GEO different from traditional SEO?',
    answer:
      'Traditional SEO optimizes for Google\'s link-based algorithm. GEO (Generative Engine Optimization) optimizes for AI systems like ChatGPT and Perplexity that cite sources. It focuses on question-based headers, citation density, E-E-A-T signals, and structured data that AI can parse.',
  },
  {
    question: 'Can you work with our existing website?',
    answer:
      'Yes. Our SEO audit and GEO optimization work with any website. Content pipelines can publish to most CMS platforms or static site generators. We adapt to your stack, not the other way around.',
  },
  {
    question: 'How quickly will we see results?',
    answer:
      'Technical SEO fixes often show impact within 2-4 weeks. Content pipeline ROI depends on publishing frequency — clients who publish weekly typically see measurable traffic growth within 60-90 days.',
  },
  {
    question: 'What does the SEO audit cover?',
    answer:
      'Technical SEO (crawlability, schema, canonical links), on-page optimization (meta tags, headings, content quality), GEO readiness (AI search signals, citation structure), and competitive gap analysis.',
  },
];

export default function DigitalMarketingContent() {
  return (
    <ServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Digital Marketing' },
      ]}
      heroTitle="Digital Marketing Systems That Run Without You"
      heroSubtitle="Automated content pipelines, AI-powered SEO audits, unified analytics dashboards, and generative engine optimization — built by engineers who actually use these systems themselves."
      heroImage="/images/services/digital-marketing-hero.png"
      painPointsTitle="Why Most Marketing Feels Like a Treadmill"
      painPoints={PAIN_POINTS}
      featuresTitle="What We Deliver"
      features={FEATURES}
      subServices={SUB_SERVICES}
      blogPosts={BLOG_POSTS}
      whyUs={WHY_US}
      faq={FAQ}
      contactTitle="Ready to Automate Your Marketing?"
      contactSubtitle="Tell us what's eating your time and we'll show you what automation looks like."
    />
  );
}
