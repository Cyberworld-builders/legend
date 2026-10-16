import { getAllPosts, type PostIndexEntry } from './post-metadata';
import { pillars, type PillarConfig } from './pillar-config';

export interface PillarPostMapping {
  pillar: PillarConfig;
  posts: PostIndexEntry[];
}

/**
 * Check if a post belongs to a pillar based on tags or explicit slugs.
 */
function postBelongsToPillar(post: PostIndexEntry, pillar: PillarConfig): boolean {
  if (pillar.explicitSlugs.includes(post.slug)) {
    return true;
  }

  const postTags = new Set(post.tags.map((t) => t.toLowerCase()));
  return pillar.tags.some((pillarTag) => postTags.has(pillarTag.toLowerCase()));
}

/**
 * Get all posts for a specific pillar, sorted by publishedDate (newest first).
 */
export function getPostsForPillar(pillarSlug: string): PostIndexEntry[] {
  const pillar = pillars.find((p) => p.slug === pillarSlug);
  if (!pillar) {
    return [];
  }

  const allPosts = getAllPosts();
  return allPosts
    .filter((post) => !post.isDraft && postBelongsToPillar(post, pillar))
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

/**
 * Get all pillar mappings with their posts.
 */
export function getAllPillarMappings(): PillarPostMapping[] {
  const allPosts = getAllPosts().filter((p) => !p.isDraft);
  
  return pillars.map((pillar) => ({
    pillar,
    posts: allPosts
      .filter((post) => postBelongsToPillar(post, pillar))
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()),
  }));
}

/**
 * Get posts that don't belong to any pillar.
 */
export function getUnmappedPosts(): PostIndexEntry[] {
  const allPosts = getAllPosts().filter((p) => !p.isDraft);
  
  return allPosts.filter((post) => {
    return !pillars.some((pillar) => postBelongsToPillar(post, pillar));
  });
}

/**
 * Get a summary of the pillar mapping for reporting.
 */
export function getPillarMappingSummary(): {
  pillars: Array<{ slug: string; title: string; postCount: number; posts: string[] }>;
  unmapped: string[];
} {
  const mappings = getAllPillarMappings();
  const unmapped = getUnmappedPosts();

  return {
    pillars: mappings.map((m) => ({
      slug: m.pillar.slug,
      title: m.pillar.title,
      postCount: m.posts.length,
      posts: m.posts.map((p) => p.slug),
    })),
    unmapped: unmapped.map((p) => p.slug),
  };
}
