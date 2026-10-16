/**
 * Related Posts Test Suite
 *
 * Validates the related posts scoring algorithm and component.
 */

import { getRelatedPosts } from '../lib/related-posts';

const createMockPost = (overrides) => ({
  slug: 'test-post',
  title: 'Test Post',
  description: 'A test post',
  publishedDate: '2026-01-15',
  modifiedDate: '2026-01-15',
  isDraft: false,
  isFeatured: false,
  priority: 0,
  category: 'Technology',
  series: '',
  topics: ['AI & Automation'],
  tags: ['ai', 'automation'],
  keywords: [],
  canonicalUrl: '',
  headerImage: '',
  wordCount: 500,
  ...overrides,
});

describe('Related Posts', () => {
  describe('getRelatedPosts', () => {
    test('should return empty array when current post not found', () => {
      const posts = [createMockPost({ slug: 'other-post' })];
      const result = getRelatedPosts('nonexistent', posts);
      expect(result).toEqual([]);
    });

    test('should exclude the current post from results', () => {
      const posts = [
        createMockPost({ slug: 'current' }),
        createMockPost({ slug: 'other', tags: ['ai'] }),
      ];
      const result = getRelatedPosts('current', posts);
      expect(result.every(p => p.slug !== 'current')).toBe(true);
    });

    test('should exclude draft posts from results', () => {
      const posts = [
        createMockPost({ slug: 'current', tags: ['ai'] }),
        createMockPost({ slug: 'draft-post', isDraft: true, tags: ['ai'] }),
        createMockPost({ slug: 'published-post', isDraft: false, tags: ['ai'] }),
      ];
      const result = getRelatedPosts('current', posts);
      expect(result.some(p => p.slug === 'draft-post')).toBe(false);
      expect(result.some(p => p.slug === 'published-post')).toBe(true);
    });

    test('should return at most the requested count', () => {
      const posts = [
        createMockPost({ slug: 'current', tags: ['ai'] }),
        createMockPost({ slug: 'post1', tags: ['ai'] }),
        createMockPost({ slug: 'post2', tags: ['ai'] }),
        createMockPost({ slug: 'post3', tags: ['ai'] }),
        createMockPost({ slug: 'post4', tags: ['ai'] }),
      ];
      const result = getRelatedPosts('current', posts, 3);
      expect(result.length).toBe(3);
    });

    test('should score series matches higher than tag matches', () => {
      const posts = [
        createMockPost({ slug: 'current', series: 'Test Series', tags: ['ai'] }),
        createMockPost({ slug: 'series-match', series: 'Test Series', tags: [] }),
        createMockPost({ slug: 'tag-match', series: '', tags: ['ai', 'automation', 'extra'] }),
      ];
      const result = getRelatedPosts('current', posts, 2);
      expect(result[0].slug).toBe('series-match');
    });

    test('should score topic matches higher than tag matches', () => {
      const posts = [
        createMockPost({ slug: 'current', topics: ['AI & Automation'], tags: ['ai'] }),
        createMockPost({ slug: 'topic-match', topics: ['AI & Automation'], tags: [] }),
        createMockPost({ slug: 'tag-match', topics: [], tags: ['ai'] }),
      ];
      const result = getRelatedPosts('current', posts, 2);
      expect(result[0].slug).toBe('topic-match');
    });

    test('should use recency as tiebreaker', () => {
      const posts = [
        createMockPost({ slug: 'current', tags: ['ai'] }),
        createMockPost({ slug: 'older', tags: ['ai'], publishedDate: '2026-01-01' }),
        createMockPost({ slug: 'newer', tags: ['ai'], publishedDate: '2026-03-01' }),
      ];
      const result = getRelatedPosts('current', posts, 2);
      expect(result[0].slug).toBe('newer');
      expect(result[1].slug).toBe('older');
    });

    test('should be deterministic (same input produces same output)', () => {
      const posts = [
        createMockPost({ slug: 'current', topics: ['AI & Automation'], tags: ['ai', 'test'] }),
        createMockPost({ slug: 'post-a', topics: ['AI & Automation'], tags: ['ai'], publishedDate: '2026-02-01' }),
        createMockPost({ slug: 'post-b', topics: ['AI & Automation'], tags: ['test'], publishedDate: '2026-03-01' }),
        createMockPost({ slug: 'post-c', topics: ['Development & Tools'], tags: ['ai'], publishedDate: '2026-01-01' }),
      ];
      const result1 = getRelatedPosts('current', posts, 3);
      const result2 = getRelatedPosts('current', posts, 3);
      const result3 = getRelatedPosts('current', posts, 3);
      
      expect(result1.map(p => p.slug)).toEqual(result2.map(p => p.slug));
      expect(result2.map(p => p.slug)).toEqual(result3.map(p => p.slug));
    });

    test('should handle posts with no common attributes', () => {
      const posts = [
        createMockPost({ slug: 'current', topics: ['AI & Automation'], tags: ['ai'], series: 'Series A', category: 'Technology' }),
        createMockPost({ slug: 'unrelated', topics: ['Career'], tags: ['career'], series: 'Series B', category: 'Business' }),
      ];
      const result = getRelatedPosts('current', posts, 3);
      expect(result.length).toBe(1);
      expect(result[0].score).toBe(0);
    });

    test('should accumulate scores from multiple matching attributes', () => {
      const posts = [
        createMockPost({
          slug: 'current',
          topics: ['AI & Automation', 'Development & Tools'],
          tags: ['ai', 'dev'],
          series: 'Test Series',
          category: 'Technology',
        }),
        createMockPost({
          slug: 'full-match',
          topics: ['AI & Automation', 'Development & Tools'],
          tags: ['ai', 'dev'],
          series: 'Test Series',
          category: 'Technology',
        }),
        createMockPost({
          slug: 'partial-match',
          topics: ['AI & Automation'],
          tags: ['ai'],
          series: '',
          category: 'Technology',
        }),
      ];
      const result = getRelatedPosts('current', posts, 2);
      expect(result[0].slug).toBe('full-match');
      expect(result[0].score).toBeGreaterThan(result[1].score);
    });

    test('should return correct post metadata in results', () => {
      const posts = [
        createMockPost({ slug: 'current', tags: ['ai'] }),
        createMockPost({
          slug: 'related',
          title: 'Related Post Title',
          description: 'Related post description',
          publishedDate: '2026-05-15',
          headerImage: '/images/related.jpg',
          category: 'AI',
          tags: ['ai'],
        }),
      ];
      const result = getRelatedPosts('current', posts, 1);
      expect(result[0]).toMatchObject({
        slug: 'related',
        title: 'Related Post Title',
        description: 'Related post description',
        publishedDate: '2026-05-15',
        headerImage: '/images/related.jpg',
        category: 'AI',
      });
      expect(typeof result[0].score).toBe('number');
    });
  });
});
