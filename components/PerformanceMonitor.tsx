'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log to console for debugging (remove in production)
        console.log('Performance metric:', entry.name, entry.value);
        
        // Send to analytics (you can integrate with your analytics service)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: entry.name,
            value: Math.round(entry.value),
            event_category: 'Web Vitals',
            event_label: entry.name,
            non_interaction: true,
          });
        }
      }
    });

    // Observe Core Web Vitals
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Monitor page load performance
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Log key metrics
          const metrics = {
            'TTFB': navEntry.responseStart - navEntry.requestStart,
            'DOM Content Loaded': navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
            'Page Load': navEntry.loadEventEnd - navEntry.navigationStart,
          };

          console.log('Navigation metrics:', metrics);
          
          // Send to analytics
          if (typeof window !== 'undefined' && window.gtag) {
            Object.entries(metrics).forEach(([name, value]) => {
              window.gtag('event', 'navigation_timing', {
                name,
                value: Math.round(value),
                event_category: 'Performance',
                event_label: name,
                non_interaction: true,
              });
            });
          }
        }
      }
    });

    navigationObserver.observe({ entryTypes: ['navigation'] });

    // Cleanup
    return () => {
      observer.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
