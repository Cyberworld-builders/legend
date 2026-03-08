import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../app/globals.css';
import AuthorSchema from '@/components/AuthorSchema';
import AnalyticsClient from '@/components/AnalyticsClient';
import FAQSchema from '@/components/FAQSchema';
import DeferredWidgets from '@/components/DeferredWidgets';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cyberworldbuilders.com'),
  title: {
    default: 'CyberWorld Builders - Digital Marketing Systems & Software Engineering',
    template: '%s | CyberWorld Builders'
  },
  description: 'Digital marketing systems, business automation, and software engineering for service businesses ready to grow. Automated lead capture, content pipelines, and reporting dashboards.',
  keywords: ['digital marketing systems', 'marketing automation', 'lead generation', 'business automation', 'software engineering', 'web development', 'consulting', 'AWS', 'cyberworld builders'],
  authors: [{ name: 'Jay Long', url: 'https://cyberworldbuilders.dev' }],
  creator: 'Jay Long',
  publisher: 'CyberWorld Builders',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cyberworldbuilders.com',
    siteName: 'CyberWorld Builders',
    title: 'CyberWorld Builders - Digital Marketing Systems & Software Engineering',
    description: 'Digital marketing systems, business automation, and software engineering for service businesses ready to grow.',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Digital Marketing Systems & Software Engineering',
      },
      {
        url: 'https://cyberworldbuilders.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cyberbuilders',
    creator: '@cyberbuilders',
    title: 'CyberWorld Builders - Digital Marketing Systems & Software Engineering',
    description: 'Digital marketing systems, business automation, and software engineering for service businesses ready to grow.',
    images: [
      'https://cyberworldbuilders.com/images/social-card.png',
      'https://cyberworldbuilders.com/images/logo.png'
    ],
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', type: 'image/x-icon' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://cyberworldbuilders.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* WebSite Schema with Search Action */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CyberWorld Builders",
              "url": "https://cyberworldbuilders.com",
              "description": "Professional software engineering services, web development consulting, and AWS solutions.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://cyberworldbuilders.com/blog?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "CyberWorld Builders",
                "url": "https://cyberworldbuilders.com"
              }
            })
          }}
        />
        
        {/* Google tag (gtag.js) - Content-focused tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NF9SF0PSM9"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NF9SF0PSM9', {
                // Focus on content engagement, not e-commerce
                send_page_view: true,
                // Custom parameters for content tracking
                custom_map: {
                  'custom_parameter_1': 'content_type',
                  'custom_parameter_2': 'blog_category'
                }
              });
            `,
          }}
        />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CyberWorld Builders",
              "alternateName": "CyberWorld Builders, Inc.",
              "url": "https://cyberworldbuilders.com",
              "logo": "https://cyberworldbuilders.com/images/logo.png",
              "description": "Professional software engineering services, web development consulting, and AWS solutions.",
              "founder": {
                "@type": "Person",
                "name": "Jay Long",
                "email": "contact@cyberworldbuilders.com",
                "url": "https://cyberworldbuilders.com"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "",
                "contactType": "customer service",
                "email": "contact@cyberworldbuilders.com",
                "availableLanguage": "English"
              },
              "sameAs": [
                "https://github.com/CyberWorld-builders",
                "https://youtube.com/@cyberbuilders",
                "https://x.com/cyberbuilders",
                "https://www.facebook.com/cyberworldbuilders",
                "https://www.upwork.com/freelancers/jaylongcyberworld"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 39.8283,
                  "longitude": -98.5795
                },
                "geoRadius": "5000000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Software Engineering Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Software Engineering",
                      "description": "Custom software development and engineering solutions"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Web Development Consulting",
                      "description": "Professional web development and consulting services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AWS Solutions",
                      "description": "Amazon Web Services implementation and optimization"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "SaaS Development",
                      "description": "Software as a Service application development"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-[#00ff00] font-mono">
        {children}
        <AnalyticsClient />
        <AuthorSchema />
        <FAQSchema />
        <DeferredWidgets />
      </body>
    </html>
  );
}