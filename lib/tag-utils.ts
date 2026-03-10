import { getAllPosts } from '@/lib/post-metadata';

/** Convert any tag string to a URL-safe slug: lowercase, non-alnum→hyphens, trim. */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a map from slug → display name (first occurrence wins). */
function buildTagMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const post of getAllPosts()) {
    for (const t of [...post.tags, ...post.keywords]) {
      const slug = slugifyTag(t);
      if (!map.has(slug)) {
        map.set(slug, t);
      }
    }
  }
  return map;
}

let _tagMap: Map<string, string> | null = null;

function getTagMap(): Map<string, string> {
  if (!_tagMap) _tagMap = buildTagMap();
  return _tagMap;
}

/** Get display name for a tag slug. Falls back to un-slugifying if not found. */
export function getTagDisplayName(slug: string): string {
  return getTagMap().get(slug) ?? slug.replace(/-/g, ' ');
}

/** Get all unique tag slugs with their display names. */
export function getAllTagSlugs(): string[] {
  return Array.from(getTagMap().keys());
}

/** Count posts for a given tag slug. */
export function getPostCountForTag(slug: string): number {
  const posts = getAllPosts();
  return posts.filter(
    (p) =>
      p.tags.some((t) => slugifyTag(t) === slug) ||
      p.keywords.some((k) => slugifyTag(k) === slug)
  ).length;
}

/** Get tag slugs that have at least `minPosts` posts. */
export function getTagSlugsWithMinPosts(minPosts: number): string[] {
  return getAllTagSlugs().filter((slug) => getPostCountForTag(slug) >= minPosts);
}

/** Get all slug→displayName pairs. */
export function getAllTagEntries(): Array<[string, string]> {
  return Array.from(getTagMap().entries());
}
