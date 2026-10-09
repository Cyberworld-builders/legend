import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { PostMeta } from './post-types';
import { loadPosts } from './posts';
import featuredPosts from './featured-posts.json';
import { mdxComponents } from '@/components/mdx/MdxComponents';

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
  headerImage: string;
  wordCount: number;
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
 * Get all published posts (for listings, sitemap, etc.), newest first.
 */
export function getAllPosts(): PostIndexEntry[] {
  return loadPosts()
    .filter(({ meta }) => !meta.isDraft)
    .map(({ meta, wordCount }) => ({
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      publishedDate: meta.publishedDate,
      modifiedDate: meta.modifiedDate,
      isDraft: meta.isDraft || false,
      isFeatured: meta.isFeatured || false,
      priority: meta.priority || 0,
      category: meta.category || '',
      series: meta.series || '',
      topics: meta.topics || [],
      tags: meta.tags || [],
      keywords: meta.keywords || [],
      canonicalUrl: meta.canonicalUrl || '',
      headerImage: meta.headerImage || '',
      wordCount,
    }));
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
      headerImage: entry.headerImage,
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

export interface FeaturedPost {
  slug: string;
  title: string;
  description: string;
  headerImage: string;
  category: string;
  publishedDate: string;
}

/**
 * Get featured posts from the static JSON file (committed by GusClaw scorer).
 * Returns empty array if no featured posts exist yet.
 */
export function getFeaturedPosts(): FeaturedPost[] {
  return featuredPosts as FeaturedPost[];
}

/**
 * Load a single published post by slug, with its MDX body as a renderable component.
 */
export async function getPostBySlug(slug: string): Promise<{ metadata: PostMeta; Component: React.ComponentType } | null> {
  const post = loadPosts().find(({ meta }) => meta.slug === slug && !meta.isDraft);
  if (!post) return null;

  const Component = () => (
    <MDXRemote
      source={post.body}
      components={mdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );

  return {
    metadata: { ...post.meta, author: DEFAULT_AUTHOR },
    Component,
  };
}
