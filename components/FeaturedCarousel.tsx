'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPost {
  slug: string;
  title: string;
  description: string;
  headerImage: string;
  category: string;
  publishedDate: string;
}

interface FeaturedCarouselProps {
  posts: FeaturedPost[];
  title?: string;
  autoRotate?: boolean;
  interval?: number;
}

export default function FeaturedCarousel({
  posts,
  title = 'Featured',
  autoRotate = true,
  interval = 6000,
}: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = posts.length;

  const goTo = useCallback((index: number) => {
    const next = ((index % count) + count) % count;
    setCurrent(next);
    scrollRef.current?.scrollTo({ left: next * scrollRef.current.offsetWidth, behavior: 'smooth' });
  }, [count]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || isPaused || count <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoRotate, isPaused, interval, next, count]);

  // Sync scroll position with current index on snap
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / el.offsetWidth);
        if (idx !== current && idx >= 0 && idx < count) {
          setCurrent(idx);
        }
      }, 100);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [current, count]);

  if (!posts || posts.length === 0) return null;

  return (
    <section id="featured" className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#00ff00]">
          {title}
        </h2>

        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Carousel track */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex-none w-full snap-center"
              >
                <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden border border-[#00ff00]/20">
                  {post.headerImage ? (
                    <Image
                      src={post.headerImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1024px"
                      priority={posts.indexOf(post) === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a]" />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {post.category && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30 rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 line-clamp-2 max-w-2xl">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation arrows */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0a0a0a]/70 border border-[#00ff00]/30 text-[#00ff00] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00ff00]/20"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0a0a0a]/70 border border-[#00ff00]/30 text-[#00ff00] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00ff00]/20"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? 'bg-[#00ff00] w-6'
                    : 'bg-[#00ff00]/30 hover:bg-[#00ff00]/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
