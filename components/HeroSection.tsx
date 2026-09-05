import Image from 'next/image';
import ReviewStrip from './ReviewStrip';
import HeroHeadline from './HeroHeadline';

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
          sizes="200px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />

        {/* Headline */}
        <HeroHeadline />

        {/* Contact CTA */}
        <div className="max-w-md mx-auto mb-6">
          <a
            href="mailto:contact@cyberworldbuilders.com?subject=Project%20inquiry"
            className="group inline-flex items-center gap-2 px-5 py-3 border border-[#00ff00]/50 rounded text-[#00ff00] hover:bg-[#00ff00]/10 transition-all duration-200 font-bold"
          >
            <span className="text-[#00ff00]/50 select-none">$</span>
            connect
          </a>
        </div>

        {/* Trust Signal */}
        <div className="mt-8">
          <ReviewStrip />
        </div>
      </div>
    </section>
  );
}
