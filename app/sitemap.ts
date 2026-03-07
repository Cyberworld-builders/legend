import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/post-metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cyberworldbuilders.com'
  
  // Static pages
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

  try {
    const posts = getAllPosts()

    blogPosts = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedDate || post.publishedDate),
      changeFrequency: 'monthly' as const,
      priority: post.isFeatured ? 0.8 : 0.7,
    }))

    // Collect unique tags
    const tags = new Set<string>()
    for (const post of posts) {
      for (const t of post.tags) tags.add(t)
      for (const k of post.keywords) tags.add(k)
    }

    tagPages = Array.from(tags).map(tag => ({
      url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Error reading blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPosts, ...tagPages]
}
