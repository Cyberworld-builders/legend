'use client';

import { getVariant } from '@/lib/ab-test';

const HERO_VARIANTS = {
  A: {
    headline: 'Turn Marketing Into a Machine.',
    subline:
      'Custom digital systems that capture leads, nurture prospects, and measure what matters.',
  },
  B: {
    headline: 'Your Marketing, on Autopilot.',
    subline:
      'Digital marketing systems that run while you run your business.',
  },
};

/**
 * Renders hero headline and subline with the correct A/B variant.
 * Must be loaded with dynamic(ssr: false) so getVariant() runs during
 * first client render (before paint), avoiding content flash and CLS.
 */
export default function HeroHeadline() {
  const { variant } = getVariant('hero_headline_v1');
  const copy = HERO_VARIANTS[variant];

  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#00ff00]">
        {copy.headline}
      </h1>
      <p className="text-lg md:text-xl text-[#00ff00]/70 mb-8 max-w-2xl mx-auto">
        {copy.subline}
      </p>
    </>
  );
}
