import type { PostIndexEntry } from './post-metadata';

export interface RelatedPostScore {
  slug: string;
  title: string;
  publishedDate: string;
  headerImage: string;
  category: string;
  description: string;
  score: number;
}

/**
 * Calculate a relatedness score between two posts based on shared tags, topics, and series.
 * Higher scores indicate more related content.
 */
function calculateRelatednessScore(
  currentPost: PostIndexEntry,
  candidatePost: PostIndexEntry
): number {
  let score = 0;

  const currentTags = new Set(currentPost.tags.map((t) => t.toLowerCase()));
  const candidateTags = new Set(candidatePost.tags.map((t) => t.toLowerCase()));
  for (const tag of currentTags) {
    if (candidateTags.has(tag)) {
      score += 3;
    }
  }

  const currentTopics = new Set(currentPost.topics.map((t) => t.toLowerCase()));
  const candidateTopics = new Set(candidatePost.topics.map((t) => t.toLowerCase()));
  for (const topic of currentTopics) {
    if (candidateTopics.has(topic)) {
      score += 5;
    }
  }

  if (
    currentPost.series &&
    candidatePost.series &&
    currentPost.series.toLowerCase() === candidatePost.series.toLowerCase()
  ) {
    score += 10;
  }

  if (
    currentPost.category &&
    candidatePost.category &&
    currentPost.category.toLowerCase() === candidatePost.category.toLowerCase()
  ) {
    score += 2;
  }

  return score;
}

/**
 * Get related posts for a given post slug.
 * 
 * Scoring:
 * - Shared series: +10 points
 * - Shared topic: +5 points per topic
 * - Shared tag: +3 points per tag
 * - Shared category: +2 points
 * 
 * Tiebreaker: more recent posts (by publishedDate) rank higher.
 * Deterministic: same input always produces same output.
 */
export function getRelatedPosts(
  currentSlug: string,
  allPosts: PostIndexEntry[],
  count: number = 3
): RelatedPostScore[] {
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost) {
    return [];
  }

  const candidates = allPosts.filter((p) => p.slug !== currentSlug && !p.isDraft);

  const scored: RelatedPostScore[] = candidates.map((post) => ({
    slug: post.slug,
    title: post.title,
    publishedDate: post.publishedDate,
    headerImage: post.headerImage,
    category: post.category,
    description: post.description,
    score: calculateRelatednessScore(currentPost, post),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  return scored.slice(0, count);
}
