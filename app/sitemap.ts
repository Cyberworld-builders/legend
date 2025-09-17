import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

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
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts/markdown')
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const filenames = await fs.readdir(postsDirectory)
    
    blogPosts = await Promise.all(
      filenames
        .filter((filename) => 
          filename.endsWith('.md') &&
          !filename.startsWith('.')
        )
        .map(async (filename) => {
          const filePath = path.join(postsDirectory, filename)
          const stats = await fs.stat(filePath)
          const slug = filename.replace(/\.md$/, '')
          
          return {
            url: `${baseUrl}/blog/${slug}`,
            lastModified: stats.mtime,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }
        })
    )
  } catch (error) {
    console.error('Error reading blog posts for sitemap:', error)
  }

  return [...staticPages, ...blogPosts]
}
