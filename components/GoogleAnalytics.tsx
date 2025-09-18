'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Extend Window interface to include gtag and tracking functions
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
    trackContentEngagement?: (action: string, content_type: string, content_id?: string) => void;
    trackSocialShare?: (platform: string, content_type: string) => void;
    trackReadingTime?: (reading_time_seconds: number, content_type: string) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views with content-focused parameters
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-NF9SF0PSM9', {
        page_path: pathname,
        // Content-focused custom parameters
        content_type: pathname.startsWith('/blog') ? 'blog_post' : 'page',
        blog_category: pathname.startsWith('/blog') ? 'technology' : 'general',
        // Disable e-commerce features
        send_page_view: true,
      });

      // Track content engagement events
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_type: pathname.startsWith('/blog') ? 'blog_post' : 'page',
        blog_category: pathname.startsWith('/blog') ? 'technology' : 'general',
      });
    }
  }, [pathname]);

  // Track content engagement events
  const trackContentEngagement = useCallback((action: string, content_type: string, content_id?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'content_engagement', {
        action,
        content_type,
        content_id,
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Track social sharing
  const trackSocialShare = useCallback((platform: string, content_type: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type,
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Track reading time
  const trackReadingTime = useCallback((reading_time_seconds: number, content_type: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'reading_time', {
        reading_time_seconds,
        content_type,
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Expose tracking functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.trackContentEngagement = trackContentEngagement;
      window.trackSocialShare = trackSocialShare;
      window.trackReadingTime = trackReadingTime;
    }
  }, [pathname, trackContentEngagement, trackSocialShare, trackReadingTime]);

  return null; // This component doesn't render anything
}
