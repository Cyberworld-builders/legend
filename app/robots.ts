import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: 'https://cyberworldbuilders.com/sitemap.xml',
  }
}
