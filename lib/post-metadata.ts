import type { PostMeta } from './post-types';
import postIndex from './post-index.json';

export type { PostMeta };

export interface PostIndexEntry {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  isDraft: boolean;
  isFeatured: boolean;
  priority: number;
  category: string;
  series: string;
  topics: string[];
  tags: string[];
  keywords: string[];
  canonicalUrl: string;
  wordCount: number;
  fileSize: number;
  fileModified: string;
}

export interface PostWithMetadata {
  slug: string;
  metadata: PostMeta;
  Component: React.ComponentType;
}

const DEFAULT_AUTHOR = {
  name: 'Jay Long',
  email: 'contact@cyberworldbuilders.com',
  url: 'https://cyberworldbuilders.com',
  social: {
    twitter: 'https://x.com/cyberbuilders',
    github: 'https://github.com/CyberWorld-builders',
  },
};

/**
 * Get all published posts from the index (for listings, sitemap, etc.)
 */
export function getAllPosts(): PostIndexEntry[] {
  return (postIndex.posts as PostIndexEntry[]).filter(p => !p.isDraft);
}

/**
 * Get all posts with full metadata — used by the blog listing page and related posts.
 * Returns PostWithMetadata[] with a dummy Component (listings don't render content).
 */
export async function getAllPostsWithMetadata(): Promise<PostWithMetadata[]> {
  const posts = getAllPosts();

  return posts.map(entry => ({
    slug: entry.slug,
    metadata: {
      title: entry.title,
      description: entry.description,
      slug: entry.slug,
      publishedDate: entry.publishedDate,
      modifiedDate: entry.modifiedDate,
      keywords: entry.keywords,
      canonicalUrl: entry.canonicalUrl,
      topics: entry.topics,
      tags: entry.tags,
      series: entry.series,
      category: entry.category,
      isDraft: entry.isDraft,
      isFeatured: entry.isFeatured,
      priority: entry.priority,
      author: DEFAULT_AUTHOR,
    },
    Component: () => null,
  }));
}

/**
 * Load a single post by slug — imports the TSX component dynamically.
 */
export async function getPostBySlug(slug: string): Promise<{ metadata: PostMeta; Component: React.ComponentType } | null> {
  try {
    const mod = await import(`@/app/blog/posts/${slug}`);
    return {
      metadata: {
        ...mod.metadata,
        author: DEFAULT_AUTHOR,
      },
      Component: mod.default,
    };
  } catch {
    return null;
  }
}

/**
 * Legacy compat: getPostWithMetadata used by [slug]/page.tsx
 */
export async function getPostWithMetadata(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  return {
    slug,
    content: '', // no longer used — Component renders directly
    metadata: post.metadata,
    fileStats: { mtime: new Date(), ctime: new Date(), size: 0 },
    Component: post.Component,
  };
}
