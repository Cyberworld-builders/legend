import { Suspense } from 'react';
import FAQ from '../components/FAQ';
import PageBackground from '../components/PageBackground';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCarousel from '../components/FeaturedCarousel';
import AboutSection from '../components/AboutSection';
import ReviewsSection from '../components/ReviewsSection';
import ContactCTA from '../components/ContactCTA';
import ClientShell from '../components/ClientShell';
import { getFeaturedPosts } from '../lib/post-metadata';

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

      {/* Scroll & behavior tracking (client-only) */}
      <Suspense fallback={null}>
        <ClientShell />
      </Suspense>

      {/* Content with higher z-index */}
      <main className="relative z-10">
        <HeroSection />

        <ScanlineDivider />

        <ServicesSection />

        <ScanlineDivider />

        <Suspense fallback={<div className="py-16 md:py-24" />}>
          <FeaturedCarousel posts={featuredPosts} title="Featured" />
        </Suspense>

        <ScanlineDivider />

        <AboutSection />

        <ScanlineDivider />

        <ReviewsSection />

        <ScanlineDivider />

        <Suspense fallback={<div className="py-16 md:py-24" />}>
          <ContactCTA />
        </Suspense>

        <ScanlineDivider />

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#0a0a0a]">
          <Suspense fallback={<div className="h-96" />}>
            <FAQ />
          </Suspense>
        </section>

      </main>
    </div>
  );
}
