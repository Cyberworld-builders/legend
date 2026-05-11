import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export default function SiteFooter() {
  return (
    <footer className="py-12 bg-[#0a0a0a] border-t border-[#00ff00]/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Services */}
          <div>
            <p className="text-sm font-bold text-[#00ff00] uppercase tracking-widest mb-4">Services</p>
            <ul className="space-y-2">
              <li><Link href="/services/digital-marketing" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">Digital Marketing</Link></li>
              <li><Link href="/services/automation" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">Automation</Link></li>
              <li><Link href="/services/custom-saas" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">Custom SaaS</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <p className="text-sm font-bold text-[#00ff00] uppercase tracking-widest mb-4">Resources</p>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">Blog</Link></li>
              <li><Link href="/cemetery-software" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">Cemetery Software</Link></li>
              <li><Link href="/services" className="text-sm text-[#00ff00]/60 hover:text-[#00ff00] transition-colors">All Services</Link></li>
            </ul>
          </div>
          {/* Connect */}
          <div>
            <p className="text-sm font-bold text-[#00ff00] uppercase tracking-widest mb-4">Connect</p>
            <SocialLinks />
            <p className="mt-4 text-sm text-[#00ff00]/60">
              {/* email_off opts out of Cloudflare's email obfuscation, which otherwise rewrites mailto links to /cdn-cgi/l/email-protection — a page Cloudflare serves without a meta description, flagged by SEO crawlers. */}
              <span dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }} />
              <a
                href="mailto:contact@cyberworldbuilders.com"
                className="hover:text-[#00ff00] transition-colors"
              >
                contact@cyberworldbuilders.com
              </a>
              <span dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }} />
            </p>
          </div>
        </div>

        <div className="relative h-px w-full overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff00]/20 to-transparent" />
        </div>

        <p className="text-sm text-[#00ff00]/60 text-center">
          &copy; {new Date().getFullYear()} CyberWorld Builders, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
