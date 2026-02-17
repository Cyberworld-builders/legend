'use client';

import { useEffect, useRef } from 'react';
import { initSession, trackEvent, trackBeacon } from '@/lib/tracking';

interface ScrollTrackerProps {
  sections: string[];
}

export default function ScrollTracker({ sections }: ScrollTrackerProps) {
  const seenSections = useRef(new Set<string>());
  const firedDepths = useRef(new Set<number>());
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize session (captures UTMs, assigns experiment)
    initSession();

    // Fire initial page_view
    trackEvent('page_view', {});

    // --- Section visibility via IntersectionObserver ---
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && !seenSections.current.has(sectionId)) {
              seenSections.current.add(sectionId);
              trackEvent('section_visible', { section: sectionId });
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    // Observe all sections
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    }

    // --- Scroll depth tracking ---
    const THRESHOLDS = [25, 50, 75, 100];
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) {
          ticking = false;
          return;
        }

        const pct = Math.round((scrollTop / docHeight) * 100);

        for (const threshold of THRESHOLDS) {
          if (pct >= threshold && !firedDepths.current.has(threshold)) {
            firedDepths.current.add(threshold);
            trackEvent('scroll_depth', { depth: threshold });
          }
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Final scroll depth on unload ---
    const onBeforeUnload = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const finalDepth = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      trackBeacon('scroll_depth_final', {
        depth: finalDepth,
        sections_seen: Array.from(seenSections.current),
      });
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('beforeunload', onBeforeUnload);
      initialized.current = false; // Reset so remount (e.g. React strict mode) re-initializes
    };
  }, [sections]);

  return null;
}
