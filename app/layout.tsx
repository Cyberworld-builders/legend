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
  themeColor: '#1a1a1a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cyberworldbuilders.com'),
  title: {
    default: 'Custom Software, AI Automation & Web Development | CyberWorld Builders',
    template: '%s | CyberWorld Builders'
  },
  description: 'CyberWorld Builders ships custom software, AI-powered automation, and full-stack web apps for service businesses. From lead capture to deployment — talk to an engineer, not a salesperson.',
  keywords: ['custom software development', 'marketing automation', 'lead generation', 'business automation', 'software engineering', 'web development', 'consulting', 'AI automation', 'cyberworld builders'],
  authors: [{ name: 'Jay Long', url: 'https://cyberworldbuilders.com' }],
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
    title: 'Custom Software, AI Automation & Web Development | CyberWorld Builders',
    description: 'CyberWorld Builders ships custom software, AI-powered automation, and full-stack web apps for service businesses. From lead capture to deployment — talk to an engineer, not a salesperson.',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders - Custom Software, AI Automation & Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cyberbuilders',
    creator: '@cyberbuilders',
    title: 'Custom Software, AI Automation & Web Development | CyberWorld Builders',
    description: 'CyberWorld Builders ships custom software, AI-powered automation, and full-stack web apps for service businesses. Talk to an engineer, not a salesperson.',
    images: ['https://cyberworldbuilders.com/images/social-card.png'],
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
              "description": "Custom software development, marketing automation, and AI-powered systems for service businesses ready to grow.",
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
              "description": "Custom software development, marketing automation, and AI-powered systems for service businesses ready to grow.",
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

        {/* Service Schema — structured data for service offerings */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Custom Software & Automation Services",
              "description": "Digital marketing systems, AI-powered automation, and custom SaaS development for service businesses.",
              "url": "https://cyberworldbuilders.com/services",
              "provider": {
                "@type": "Organization",
                "name": "CyberWorld Builders",
                "url": "https://cyberworldbuilders.com"
              },
              "serviceType": "Software Development",
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Software & Automation Services",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Digital Marketing",
                    "url": "https://cyberworldbuilders.com/services/digital-marketing",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "GEO Optimization",
                          "url": "https://cyberworldbuilders.com/services/digital-marketing/geo-optimization",
                          "description": "Generative Engine Optimization for AI search visibility."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Automated SEO Audit",
                          "url": "https://cyberworldbuilders.com/services/digital-marketing/seo-audit",
                          "description": "Continuous automated SEO audits with auto-fix capabilities."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Content Pipeline Automation",
                          "url": "https://cyberworldbuilders.com/services/digital-marketing/content-pipeline",
                          "description": "Transcript-to-blog publishing with social distribution."
                        }
                      }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Automation",
                    "url": "https://cyberworldbuilders.com/services/automation",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Agent Development",
                          "url": "https://cyberworldbuilders.com/services/automation/ai-agents",
                          "description": "Custom AI agents with tool-use, memory, and multi-step reasoning."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "n8n Workflow Automation",
                          "url": "https://cyberworldbuilders.com/services/automation/n8n-workflows",
                          "description": "Visual workflow automation with 400+ integrations."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Chatbot Development",
                          "url": "https://cyberworldbuilders.com/services/automation/ai-chatbots",
                          "description": "Intelligent chatbots with RAG knowledge bases and lead qualification."
                        }
                      }
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Custom SaaS",
                    "url": "https://cyberworldbuilders.com/services/custom-saas",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Next.js Web Applications",
                          "url": "https://cyberworldbuilders.com/services/custom-saas/nextjs-apps",
                          "description": "Full-stack Next.js applications with SSR, App Router, and Supabase."
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "MVP Development",
                          "url": "https://cyberworldbuilders.com/services/custom-saas/mvp-development",
                          "description": "Rapid prototyping and lean validation — ship in 4 weeks."
                        }
                      }
                    ]
                  }
                ]
              }
            })
          }}
        />

        {/* LocalBusiness Schema — captures local intent queries like "it companies near me" */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://cyberworldbuilders.com/#business",
              "name": "CyberWorld Builders",
              "url": "https://cyberworldbuilders.com",
              "logo": "https://cyberworldbuilders.com/images/logo.png",
              "image": "https://cyberworldbuilders.com/images/social-card.png",
              "description": "Custom software development, AI automation, and full-stack web apps for service businesses. Talk to an engineer, not a salesperson.",
              "email": "contact@cyberworldbuilders.com",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Guntersville",
                "addressRegion": "AL",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 34.3582,
                "longitude": -86.2947
              },
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "serviceType": [
                "Custom Software Development",
                "Marketing Automation",
                "Web Development",
                "AI Integration",
                "Business Automation",
                "Technical Consulting"
              ],
              "knowsAbout": [
                "Next.js",
                "React",
                "AWS",
                "AI Agents",
                "SEO Automation",
                "Cemetery Management Software"
              ],
              "sameAs": [
                "https://github.com/CyberWorld-builders",
                "https://youtube.com/@cyberbuilders",
                "https://x.com/cyberbuilders",
                "https://www.facebook.com/cyberworldbuilders",
                "https://www.upwork.com/freelancers/jaylongcyberworld"
              ]
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