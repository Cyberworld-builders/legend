'use client';

import FAQ from '../components/FAQ';
import PageBackground from '../components/PageBackground';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCarousel from '../components/FeaturedCarousel';
import AboutSection from '../components/AboutSection';
import ContactCTA from '../components/ContactCTA';
import { getFeaturedPosts } from '../lib/post-metadata';
import dynamic from 'next/dynamic';

const ScrollTracker = dynamic(() => import('../components/ScrollTracker'), { ssr: false });

const TRACKED_SECTIONS = ['hero', 'services', 'featured', 'about', 'contact', 'faq'];

const featuredPosts = getFeaturedPosts();

function ScanlineDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Page Background */}
      <PageBackground opacity={15} fullWidth={true} />

      {/* Scroll & behavior tracking */}
      <ScrollTracker sections={TRACKED_SECTIONS} />

      {/* Content with higher z-index */}
      <main className="relative z-10">
        <HeroSection />

        <ScanlineDivider />

        <ServicesSection />

        <ScanlineDivider />

        <FeaturedCarousel posts={featuredPosts} title="Featured" />

        <ScanlineDivider />

        <AboutSection />

        <ScanlineDivider />

        <ContactCTA />

        <ScanlineDivider />

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#0a0a0a]">
          <FAQ />
        </section>

      </main>
    </div>
  );
}
