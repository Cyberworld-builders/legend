import { MetadataRoute } from 'next'
import { getAllPostsWithMetadata } from '@/lib/post-metadata'

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

  // Dynamic blog posts and tag pages
  let blogPosts: MetadataRoute.Sitemap = []
  let tagPages: MetadataRoute.Sitemap = []

  try {
    const allPostsWithMetadata = await getAllPostsWithMetadata()
    
    // Blog posts
    blogPosts = allPostsWithMetadata.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.modifiedDate || post.fileStats.mtime,
      changeFrequency: 'monthly' as const,
      priority: post.metadata.isFeatured ? 0.8 : 0.6,
    }))

    // Tag pages - collect all unique tags
    const allTags = new Set<string>()
    allPostsWithMetadata.forEach(post => {
      post.metadata.tags?.forEach(tag => allTags.add(tag))
      post.metadata.keywords?.forEach(keyword => allTags.add(keyword))
    })

    tagPages = Array.from(allTags).map(tag => ({
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
