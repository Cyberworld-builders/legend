'use client';

import {
  Search,
  FileCode,
  CheckCircle,
  BarChart3,
  ScanLine,
  Star,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Search,
    title: 'Technical SEO',
    description:
      'Crawlability, indexation, canonical links, redirect chains, broken links, and server response times — all checked automatically.',
  },
  {
    icon: FileCode,
    title: 'On-Page Optimization',
    description:
      'Meta tags, heading hierarchy, content length, keyword density, image alt text, and internal linking structure.',
  },
  {
    icon: CheckCircle,
    title: 'Schema Validation',
    description:
      'Structured data markup verified against Google\'s requirements. Organization, FAQ, Product, Service, and Article schemas.',
  },
  {
    icon: BarChart3,
    title: 'Crawlability & Performance',
    description:
      'Robots.txt validation, sitemap completeness, page speed indicators, and mobile responsiveness checks.',
  },
];

const STEPS = [
  {
    title: 'Crawl',
    description:
      'Our automated crawler visits every page on your site, checking technical SEO, on-page elements, schema markup, and GEO readiness signals.',
  },
  {
    title: 'Score',
    description:
      'Each issue gets classified by severity (critical, warning, notice) and type. You see a clear prioritized list — not a 200-page PDF.',
  },
  {
    title: 'Auto-Fix',
    description:
      'Issues that can be fixed programmatically (meta tags, schema, canonical links, AI crawler rules) get fixed automatically via pull request.',
  },
  {
    title: 'Report',
    description:
      'Manual issues get a clear action item with context and priority. Weekly reports show progress, new issues, and resolved items.',
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
  { title: 'GEO Optimization', href: '/services/digital-marketing/geo-optimization' },
  { title: 'Content Pipeline', href: '/services/digital-marketing/content-pipeline' },
  { title: 'Digital Marketing', href: '/services/digital-marketing' },
];

const FAQ = [
  {
    question: 'How often does the audit run?',
    answer:
      'The automated audit runs on a configurable schedule — typically daily for critical sites and weekly for others. You can also trigger manual audits anytime.',
  },
  {
    question: 'What gets auto-fixed vs. manual?',
    answer:
      'Auto-fixable: meta tags, schema properties, canonical links, AI crawler rules, and robots.txt entries. Manual: broken external links, slow server responses, thin content, and redirect chains that need business decisions.',
  },
  {
    question: 'Do I need to give you access to my codebase?',
    answer:
      'For the auto-fix feature, yes — we need push access to create pull requests. For audit-only, we just need the URL. The audit crawls your public-facing site like any search engine would.',
  },
  {
    question: 'How is this different from Screaming Frog or Ahrefs?',
    answer:
      'Those tools generate reports. Our system generates reports AND fixes what it can automatically. It also includes GEO-specific checks that traditional tools don\'t cover — AI crawler access, citation density, and question-header analysis.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Pricing depends on site size and audit frequency. We offer both one-time audit packages and ongoing monitoring subscriptions. Contact us for a quote.',
  },
];

export default function SeoAuditContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'SEO Audit' },
      ]}
      heroTitle="SEO Audits That Fix Themselves"
      heroSubtitle="Continuous automated crawling, scoring, and auto-fixing of technical SEO issues. Problems get caught and resolved before they cost you rankings."
      heroImage="/images/services/seo-audit-hero.png"
      capabilitiesTitle="What We Check"
      capabilities={CAPABILITIES}
      stepsTitle="How It Works"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Get Your SEO Audit"
      contactSubtitle="Tell us about your site and we'll run an initial assessment."
    />
  );
}
