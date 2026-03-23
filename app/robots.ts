import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cdn-cgi/', '/forgot-password', '/reset-password'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended', 'cohere-ai'],
        allow: '/',
        disallow: ['/admin/', '/api/', '/cdn-cgi/', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: 'https://cyberworldbuilders.com/sitemap.xml',
  }
}
