'use client';

import FAQ from '../components/FAQ';
import PageBackground from '../components/PageBackground';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import ProofSection from '../components/ProofSection';
import AboutSection from '../components/AboutSection';
import ContactCTA from '../components/ContactCTA';
import SocialLinks from '../components/SocialLinks';
import ScrollTracker from '../components/ScrollTracker';

const TRACKED_SECTIONS = ['hero', 'services', 'proof', 'about', 'contact', 'faq'];

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

        <ServicesSection />

        <ProofSection />

        <AboutSection />

        <ContactCTA />

        {/* FAQ Section */}
        <section className="py-16">
          <FAQ />
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-[#00ff00]/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SocialLinks />
            <p className="mt-6 text-sm text-[#00ff00]/70">
              <a
                href="mailto:contact@cyberworldbuilders.com"
                className="hover:underline"
              >
                contact@cyberworldbuilders.com
              </a>
            </p>
            <p className="mt-4 text-sm text-[#00ff00]/50">
              &copy; {new Date().getFullYear()} CyberWorld Builders, Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

    </div>
  );
}
