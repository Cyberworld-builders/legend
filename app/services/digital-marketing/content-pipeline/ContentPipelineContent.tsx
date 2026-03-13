'use client';

import {
  Mic,
  BrainCircuit,
  Image,
  Share2,
  FileInput,
  Sparkles,
  Eye,
  Send,
} from 'lucide-react';
import MetaServicePageLayout from '@/components/MetaServicePageLayout';

const CAPABILITIES = [
  {
    icon: Mic,
    title: 'Transcript-to-Blog',
    description:
      'Record a voice memo or paste a transcript. AI editing preserves your voice while restructuring for readability, SEO, and GEO.',
  },
  {
    icon: Share2,
    title: 'Social Distribution',
    description:
      'Each blog post automatically generates platform-specific social copy for LinkedIn, X, and Facebook — ready to post.',
  },
  {
    icon: Image,
    title: 'Hero Image Generation',
    description:
      'DALL-E 3 generates photorealistic hero images tailored to each post\'s topic. No stock photos, no generic AI art.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Editing Pipeline',
    description:
      'Multi-stage AI editing: structure, clarity, voice preservation, SEO optimization, and GEO signals — all while keeping your authentic voice.',
  },
];

const STEPS = [
  {
    title: 'Input',
    description:
      'Submit a voice memo, transcript, or rough draft through a simple mobile-friendly interface. One tap to start the pipeline.',
  },
  {
    title: 'AI Processing',
    description:
      'The transcript gets classified, edited through multiple AI stages, tagged for SEO, and formatted as a publishable blog post.',
  },
  {
    title: 'Review',
    description:
      'A pull request appears with the full post, hero image, social copy, and metadata. Review, suggest changes, or approve as-is.',
  },
  {
    title: 'Publish',
    description:
      'Merge the PR and the post goes live automatically. The site rebuilds, sitemap updates, and the post is indexed.',
  },
  {
    title: 'Distribute',
    description:
      'Social copy gets posted to your configured platforms. Analytics start tracking engagement from day one.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Content Publishing Engine: Voice Memos to Video',
    href: '/blog/content-publishing-engine-voice-memos-to-video',
    image: '/images/content-publishing-engine-voice-memos-to-video-hero.png',
  },
];

const CROSS_LINKS = [
  { title: 'GEO Optimization', href: '/services/digital-marketing/geo-optimization' },
  { title: 'SEO Audit', href: '/services/digital-marketing/seo-audit' },
  { title: 'Digital Marketing', href: '/services/digital-marketing' },
];

const FAQ = [
  {
    question: 'What kind of input does the pipeline accept?',
    answer:
      'Voice memos (audio files), raw transcripts (text), or rough drafts. The system handles classification, formatting, and optimization regardless of input quality.',
  },
  {
    question: 'Does the AI rewrite my content?',
    answer:
      'No. The AI edits for structure, clarity, and SEO — but preserves your voice, opinions, and expertise. It\'s an editor, not a ghostwriter. Your ideas and perspective stay intact.',
  },
  {
    question: 'How many posts can it handle?',
    answer:
      'The pipeline processes posts sequentially with rate limiting to respect API quotas. Typical throughput is 5-10 posts per day, though we can scale higher with parallel processing.',
  },
  {
    question: 'What platforms does it publish to?',
    answer:
      'The blog pipeline targets static site generators (Next.js, Hugo, Jekyll) via Git. Social distribution covers LinkedIn, X (Twitter), and Facebook. We can add additional platforms on request.',
  },
  {
    question: 'Can I customize the AI editing style?',
    answer:
      'Yes. We create a voice DNA profile from your existing content, which guides the AI editor. Tone, vocabulary, sentence structure, and formatting preferences are all configurable.',
  },
];

export default function ContentPipelineContent() {
  return (
    <MetaServicePageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'Content Pipeline' },
      ]}
      heroTitle="Content Pipelines That Publish Themselves"
      heroSubtitle="Record a voice memo. Get a published blog post with hero image, social copy, and cross-platform distribution — without touching a CMS."
      heroImage="/images/services/content-pipeline-hero.png"
      capabilitiesTitle="What We Build"
      capabilities={CAPABILITIES}
      stepsTitle="How It Works"
      steps={STEPS}
      blogPosts={BLOG_POSTS}
      crossLinks={CROSS_LINKS}
      faq={FAQ}
      contactTitle="Ready to Automate Your Content?"
      contactSubtitle="Tell us about your content workflow and we'll design a pipeline."
    />
  );
}
