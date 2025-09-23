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
  ]

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const allPostsWithMetadata = await getAllPostsWithMetadata()
    
    blogPosts = allPostsWithMetadata.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.modifiedDate || post.fileStats.mtime,
      changeFrequency: 'monthly' as const,
      priority: post.metadata.isFeatured ? 0.8 : 0.6,
    }))
  } catch (error) {
    console.error('Error reading blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPosts]
}
