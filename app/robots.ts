import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // /api/og renders fallback social cards; X's crawler honors robots.txt.
        allow: ['/', '/api/og'],
        disallow: ['/admin/', '/api/', '/cdn-cgi/', '/forgot-password', '/reset-password'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://cyberworldbuilders.com/sitemap.xml',
  }
}
