import type { Metadata, Viewport } from 'next';
import '../app/globals.css';
import AuthorSchema from '@/components/AuthorSchema';
import SiteFooter from '@/components/SiteFooter';
import AnalyticsClient from '@/components/AnalyticsClient';
import DeferredWidgets from '@/components/DeferredWidgets';
import TerminalNav from '@/components/TerminalNav';

const siteDescription = 'A personal technology workshop exploring human–AI collaboration, creative tools, immersive experiences, and the systems that bring them to life.';
const socialCard = '/api/og?title=CyberWorld%20Builders&description=A%20personal%20technology%20workshop%20for%20useful%20systems%20and%20unusual%20ideas.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a1a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cyberworldbuilders.com'),
  title: {
    default: 'CyberWorld Builders — Useful systems. Unusual ideas.',
    template: '%s | CyberWorld Builders',
  },
  description: siteDescription,
  authors: [{ name: 'Jay Long', url: 'https://cyberworldbuilders.com' }],
  creator: 'Jay Long',
  publisher: 'CyberWorld Builders',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cyberworldbuilders.com',
    siteName: 'CyberWorld Builders',
    title: 'CyberWorld Builders — Useful systems. Unusual ideas.',
    description: siteDescription,
    images: [{ url: socialCard, width: 1200, height: 630, alt: 'CyberWorld Builders: a personal technology workshop' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cyberbuilders',
    creator: '@cyberbuilders',
    title: 'CyberWorld Builders — Useful systems. Unusual ideas.',
    description: siteDescription,
    images: [socialCard],
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', type: 'image/x-icon' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  alternates: { canonical: 'https://cyberworldbuilders.com' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/images/logo.png" as="image" type="image/png" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CyberWorld Builders',
              url: 'https://cyberworldbuilders.com',
              logo: 'https://cyberworldbuilders.com/images/logo.png',
              description: siteDescription,
              founder: { '@type': 'Person', name: 'Jay Long', url: 'https://cyberworldbuilders.com' },
              sameAs: [
                'https://github.com/CyberWorld-builders',
                'https://youtube.com/@cyberbuilders',
                'https://x.com/cyberbuilders',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#1a1a1a] text-[#00ff00] font-mono">
        <TerminalNav />
        <div className="pt-12">{children}</div>
        <SiteFooter />
        <AnalyticsClient />
        <AuthorSchema />
        <DeferredWidgets />
      </body>
    </html>
  );
}
