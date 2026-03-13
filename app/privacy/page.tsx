import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageBackground from '@/components/PageBackground';

export const metadata: Metadata = {
  title: 'Privacy Policy — CyberWorld Builders',
  description: 'Privacy policy for CyberWorld Builders, including how we handle data from third-party integrations.',
  alternates: { canonical: 'https://cyberworldbuilders.com/privacy' },
};

export default function PrivacyPolicy() {
  const lastUpdated = 'March 10, 2026';

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
      <PageBackground opacity={20} fullWidth={true} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8 mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy Policy' },
            ]}
          />
        </div>

        <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#00ff00] mb-8">Privacy Policy</h1>
          <p className="text-[#00ff00]/50 text-sm mb-8">Last updated: {lastUpdated}</p>

          <div className="space-y-8 text-[#00ff00]/80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Who We Are</h2>
              <p>
                CyberWorld Builders is a software engineering and consulting company operated by Jay Long.
                Our website is <Link href="/" className="text-[#00ff00] underline">cyberworldbuilders.com</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Information We Collect</h2>
              <p className="mb-3">We collect minimal information necessary to operate our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#00ff00]">Contact information</strong> you voluntarily provide through our chat widget or contact forms (name, email, phone number).</li>
                <li><strong className="text-[#00ff00]">Usage data</strong> collected automatically, including pages visited, referral source, and browser type, via standard web analytics.</li>
                <li><strong className="text-[#00ff00]">Chat transcripts</strong> from conversations with our on-site chatbot, used to improve our services and follow up on inquiries.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Third-Party Integrations</h2>
              <p className="mb-3">Our internal tools connect to the following third-party platforms to publish content and track performance:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#00ff00]">LinkedIn</strong> — We use the LinkedIn API to share blog posts and track engagement on our company page. We access only our own page analytics and do not collect or store LinkedIn user data from visitors.</li>
                <li><strong className="text-[#00ff00]">Facebook</strong> — We use the Facebook Pages API to publish posts to our company page and view post insights. No visitor data from Facebook is collected.</li>
                <li><strong className="text-[#00ff00]">X (Twitter)</strong> — We may use the X API to share content and view engagement metrics on our own posts.</li>
                <li><strong className="text-[#00ff00]">Google</strong> — We use Google Analytics, Google Search Console, and Google PageSpeed Insights to monitor site performance and search visibility.</li>
              </ul>
              <p className="mt-3">These integrations access only our own accounts and content. We do not collect, store, or process personal data from users of these platforms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your inquiries and provide consulting services</li>
                <li>To improve our website and content based on aggregate usage patterns</li>
                <li>To publish and promote our blog content across social platforms</li>
                <li>To monitor SEO performance and site health</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Data Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties. We may share data with service providers (hosting, analytics) who assist in operating our website, subject to confidentiality agreements.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Data Retention</h2>
              <p>Contact information and chat transcripts are retained for as long as necessary to provide our services and maintain business records. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Cookies</h2>
              <p>We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. No advertising or tracking cookies are used.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Your Rights</h2>
              <p>You have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, contact us at the email below.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00ff00] mb-3">Contact</h2>
              <p>
                For privacy-related questions or requests, contact us at{' '}
                <a href="mailto:contact@cyberworldbuilders.com" className="text-[#00ff00] underline">
                  contact@cyberworldbuilders.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-12 mb-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
