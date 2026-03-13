/**
 * Featured Carousel — build validation tests.
 *
 * Validates that all required files exist and the component / data pipeline
 * follow expected structure. No database — data comes from featured-posts.json.
 */

const fs = require('fs');

describe('Featured Carousel', () => {
  describe('Required Files', () => {
    test('should have FeaturedCarousel component', () => {
      expect(fs.existsSync('components/FeaturedCarousel.tsx')).toBe(true);
    });

    test('should have featured-posts.json', () => {
      expect(fs.existsSync('lib/featured-posts.json')).toBe(true);
    });

    test('featured-posts.json should be valid JSON array', () => {
      const data = JSON.parse(fs.readFileSync('lib/featured-posts.json', 'utf8'));
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Component Structure', () => {
    let componentSource;

    beforeAll(() => {
      componentSource = fs.readFileSync('components/FeaturedCarousel.tsx', 'utf8');
    });

    test('should be a client component', () => {
      expect(componentSource).toContain("'use client'");
    });

    test('should accept posts prop', () => {
      expect(componentSource).toContain('posts:');
    });

    test('should accept title prop', () => {
      expect(componentSource).toContain('title?:');
    });

    test('should accept autoRotate prop', () => {
      expect(componentSource).toContain('autoRotate?:');
    });

    test('should accept interval prop', () => {
      expect(componentSource).toContain('interval?:');
    });

    test('should link to blog posts', () => {
      expect(componentSource).toContain('/blog/${post.slug}');
    });

    test('should use scroll-snap for mobile swipe', () => {
      expect(componentSource).toContain('snap-x');
      expect(componentSource).toContain('snap-mandatory');
    });

    test('should have navigation arrows', () => {
      expect(componentSource).toContain('ChevronLeft');
      expect(componentSource).toContain('ChevronRight');
    });

    test('should have dot indicators', () => {
      expect(componentSource).toContain('aria-label={`Go to slide');
    });

    test('should pause on hover', () => {
      expect(componentSource).toContain('onMouseEnter');
      expect(componentSource).toContain('setIsPaused(true)');
    });

    test('should use Next.js Image for optimization', () => {
      expect(componentSource).toContain("from 'next/image'");
    });

    test('should use terminal theme colors', () => {
      expect(componentSource).toContain('#00ff00');
      expect(componentSource).toContain('#0a0a0a');
    });
  });

  describe('Data Shape', () => {
    test('FeaturedPost interface should have required fields', () => {
      const source = fs.readFileSync('components/FeaturedCarousel.tsx', 'utf8');
      const requiredFields = ['slug', 'title', 'description', 'headerImage', 'category', 'publishedDate'];
      requiredFields.forEach(field => {
        expect(source).toContain(`${field}:`);
      });
    });
  });

  describe('Homepage Integration', () => {
    test('homepage should import FeaturedCarousel', () => {
      const source = fs.readFileSync('app/page.tsx', 'utf8');
      expect(source).toContain('FeaturedCarousel');
    });

    test('homepage should not import ProofSection', () => {
      const source = fs.readFileSync('app/page.tsx', 'utf8');
      expect(source).not.toContain("import ProofSection from");
    });

    test('homepage should track featured section', () => {
      const source = fs.readFileSync('app/page.tsx', 'utf8');
      expect(source).toContain('featured');
    });

    test('homepage should use getFeaturedPosts (static import, no API fetch)', () => {
      const source = fs.readFileSync('app/page.tsx', 'utf8');
      expect(source).toContain('getFeaturedPosts');
      expect(source).not.toContain("fetch('/api/featured')");
    });
  });

  describe('Blog Index Integration', () => {
    test('blog index should import FeaturedCarousel', () => {
      const source = fs.readFileSync('app/blog/page.tsx', 'utf8');
      expect(source).toContain('FeaturedCarousel');
    });

    test('blog index should use getFeaturedPosts (static import, no Supabase)', () => {
      const source = fs.readFileSync('app/blog/page.tsx', 'utf8');
      expect(source).toContain('getFeaturedPosts');
      expect(source).not.toContain("featured_posts");
    });
  });

  describe('Post Index', () => {
    test('post-metadata.ts should include headerImage in PostIndexEntry', () => {
      const source = fs.readFileSync('lib/post-metadata.ts', 'utf8');
      expect(source).toContain('headerImage');
    });

    test('post-metadata.ts should export getFeaturedPosts', () => {
      const source = fs.readFileSync('lib/post-metadata.ts', 'utf8');
      expect(source).toContain('getFeaturedPosts');
    });

    test('post-metadata.ts should import featured-posts.json', () => {
      const source = fs.readFileSync('lib/post-metadata.ts', 'utf8');
      expect(source).toContain("featured-posts.json");
    });

    test('post index generator should extract headerImage', () => {
      const source = fs.readFileSync('scripts/generate-post-index-new.js', 'utf8');
      expect(source).toContain('headerImage');
    });
  });

  describe('No Database Dependencies', () => {
    test('should not have automation featured API route', () => {
      expect(fs.existsSync('app/api/automation/featured/route.ts')).toBe(false);
    });

    test('should not have public featured API route', () => {
      expect(fs.existsSync('app/api/featured/route.ts')).toBe(false);
    });
  });
});
