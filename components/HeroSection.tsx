'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { trackEvent } from '@/lib/tracking';
import TurnstileField from './TurnstileField';

const HeroHeadline = dynamic(() => import('./HeroHeadline'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse" aria-hidden>
      <div className="h-9 md:h-14 w-full max-w-2xl mx-auto mb-4 bg-[#00ff00]/10 rounded" />
      <div className="h-5 md:h-6 w-full max-w-2xl mx-auto mb-8 bg-[#00ff00]/5 rounded" />
    </div>
  ),
});

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(null), []);

  const needsTurnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const canSubmit = !needsTurnstile || turnstileToken;

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError('');

    trackEvent('cta_click', { cta: 'hero_email' });

    try {
      const payload: Record<string, unknown> = { email };
      if (turnstileToken) payload.turnstileToken = turnstileToken;

      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      setEmail('');
      trackEvent('lead_submit', { cta: 'hero_email' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="CyberWorld Builders Logo"
          className="mx-auto mb-6"
          width={200}
          height={200}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Headline - loaded client-only with correct variant before first paint */}
        <HeroHeadline />

        {/* Email-only CTA */}
        <div className="max-w-md mx-auto mb-6">
          {submitted ? (
            <div className="text-[#00ff00] font-semibold py-3">
              Thanks! I&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg text-[#00ff00] placeholder-[#00ff00]/40 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                className="px-6 py-3 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {isSubmitting ? '...' : "Let's Talk"}
                </button>
              </div>
              <TurnstileField onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />
            </form>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Trust Signal */}
        <p className="mt-8 text-sm text-[#00ff00]/50">
          10+ years in tech | AWS Certified | Building systems for service businesses
        </p>
      </div>
    </section>
  );
}
