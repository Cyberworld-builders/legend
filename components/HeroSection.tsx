'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

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

        {/* Contact CTA */}
        <div className="max-w-md mx-auto mb-6">
          <a
            href="mailto:contact@cyberworldbuilders.com?subject=Project%20inquiry"
            className="inline-block px-6 py-3 bg-[#00ff00] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#00cc00] transition-colors"
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Trust Signal */}
        <p className="mt-8 text-sm text-[#00ff00]/50">
          10+ years in tech | AWS Certified | Building systems for service businesses
        </p>
      </div>
    </section>
  );
}
