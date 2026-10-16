import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/post-metadata'
import { getTagSlugsWithMinPosts } from '@/lib/tag-utils'
import { getPillarIds } from '@/lib/pillar-config'
import { getPostsForPillar } from '@/lib/pillar-posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cyberworldbuilders.com'
  
  // Static pages
  // Note: Legacy service pages (/services/*, /cemetery-software) are excluded
  // from the sitemap as they are noindex and describe past services.
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  let tagPages: MetadataRoute.Sitemap = []
  let pillarPages: MetadataRoute.Sitemap = []

  try {
    const posts = getAllPosts()

    blogPosts = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedDate || post.publishedDate),
      changeFrequency: 'monthly' as const,
      priority: post.isFeatured ? 0.8 : 0.7,
    }))

    // Only include tag pages with 3+ posts in sitemap (thin tags get noindex)
    tagPages = getTagSlugsWithMinPosts(3).map(slug => ({
      url: `${baseUrl}/blog/tag/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    // Pillar hub pages
    pillarPages = getPillarIds().map(pillarSlug => {
      const pillarPosts = getPostsForPillar(pillarSlug)
      const latestModified = pillarPosts.length > 0
        ? pillarPosts.reduce((latest, p) => {
            const pDate = p.modifiedDate || p.publishedDate
            return pDate > latest ? pDate : latest
          }, pillarPosts[0].modifiedDate || pillarPosts[0].publishedDate)
        : new Date().toISOString().slice(0, 10)

      return {
        url: `${baseUrl}/field-notes/${pillarSlug}`,
        lastModified: new Date(latestModified),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }
    })
  } catch (error) {
    console.error('Error reading blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPosts, ...tagPages, ...pillarPages]
}
