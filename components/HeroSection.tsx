'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/tracking';
import TurnstileField from './TurnstileField';

const HeroHeadline = dynamic(() => import('./HeroHeadline'), {
  ssr: false,
  loading: () => (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#00ff00]">
        Turn Marketing Into a Machine.
      </h1>
      <p className="text-lg md:text-xl text-[#00ff00]/70 mb-8 max-w-2xl mx-auto">
        Custom digital systems that capture leads, nurture prospects, and measure what matters.
      </p>
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
          sizes="200px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Headline */}
        <HeroHeadline />

        {/* Terminal-style CTA or email form */}
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
                  aria-label="Email address"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#00ff00]/30 rounded text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="group inline-flex items-center gap-2 px-5 py-3 border border-[#00ff00]/50 rounded text-[#00ff00] hover:bg-[#00ff00]/10 transition-all duration-200 disabled:opacity-50 whitespace-nowrap font-bold"
                >
                  {isSubmitting ? '...' : (
                    <>
                      <span className="text-[#00ff00]/50 select-none">$</span>
                      connect
                      <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </>
                  )}
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
        <p className="mt-8 text-sm text-[#00ff00]/70">
          10+ years in tech | AWS Certified | Building systems for service businesses
        </p>
      </div>
    </section>
  );
}
