'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  onContactClick?: () => void;
}

export default function HeroSection({ onContactClick }: HeroSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 md:py-24">
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

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#00ff00]">
          Resurrect Your Dreams.
          <br />
          <span className="text-[#00ff00]/80">Automate with AI.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#00ff00]/70 mb-8 max-w-2xl mx-auto">
          Custom AI automation flows, workflow solutions, and web applications
          for small businesses ready to scale without the overhead.
        </p>

        {/* Email-only CTA */}
        <div className="max-w-md mx-auto mb-6">
          {submitted ? (
            <div className="text-[#00ff00] font-semibold py-3">
              Thanks! I&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
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
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? '...' : 'Get Started'}
              </button>
            </form>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>



        {/* Trust Signal */}
        <p className="mt-8 text-sm text-[#00ff00]/50">
          AWS Certified | 10+ Years in Tech | Based in the USA
        </p>




      </div>
    </section>
  );
}
