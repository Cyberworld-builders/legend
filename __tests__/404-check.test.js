/**
 * 404 Check Test Suite
 * 
 * This test suite verifies that all expected pages return 200 OK
 * and are not returning 404 errors. It covers:
 * - Static pages (home, blog index, tags index)
 * - All blog posts
 * - All tag pages
 * - Sitemap and robots.txt
 */

const fs = require('fs');
const path = require('path');

describe('404 Check - All Expected Pages', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3001';
  
  // Static pages that should always exist
  const staticPages = [
    '/',
    '/blog',
    '/blog/tags',
    '/sitemap.xml',
    '/robots.txt'
  ];

  // Test static pages
  describe('Static Pages', () => {
    staticPages.forEach(page => {
      test(`should return 200 for ${page}`, async () => {
        const response = await fetch(`${baseUrl}${page}`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
      });
    });
  });

  // Test all blog posts
  describe('Blog Posts', () => {
    let allPosts;
    
    beforeAll(() => {
      try {
        const postsDir = path.join(__dirname, '../app/blog/posts/markdown');
        const files = fs.readdirSync(postsDir);
        allPosts = files
          .filter(file => file.endsWith('.md'))
          .map(file => ({
            slug: file.replace('.md', ''),
            file: file
          }));
      } catch (error) {
        console.error('Error loading posts for testing:', error);
        allPosts = [];
      }
    });

    test('should have posts to test', () => {
      expect(allPosts.length).toBeGreaterThan(0);
    });

    if (allPosts && allPosts.length > 0) {
      allPosts.forEach(post => {
        test(`should return 200 for blog post: ${post.slug}`, async () => {
          const response = await fetch(`${baseUrl}/blog/${post.slug}`);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe('OK');
        });
      });
    } else {
      test('should have posts to test', () => {
        expect(allPosts).toBeDefined();
        expect(allPosts.length).toBeGreaterThan(0);
      });
    }
  });

  // Test tag pages
  describe('Tag Pages', () => {
    let allTags;
    
    beforeAll(() => {
      try {
        const postsDir = path.join(__dirname, '../app/blog/posts/markdown');
        const files = fs.readdirSync(postsDir);
        allTags = new Set();
        
        files.forEach(file => {
          if (file.endsWith('.md')) {
            const filePath = path.join(postsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract tags from frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
              const frontmatter = frontmatterMatch[1];
              
              // Extract tags
              const tagsMatch = frontmatter.match(/^tags:\s*\n((?:  - .*\n?)*)/m);
              if (tagsMatch) {
                const tagsSection = tagsMatch[1];
                const tagLines = tagsSection.split('\n').filter(line => line.trim().startsWith('- '));
                tagLines.forEach(line => {
                  const tag = line.replace(/^\s*-\s*/, '').trim();
                  if (tag) allTags.add(tag);
                });
              }
              
              // Extract keywords
              const keywordsMatch = frontmatter.match(/^keywords:\s*\n((?:  - .*\n?)*)/m);
              if (keywordsMatch) {
                const keywordsSection = keywordsMatch[1];
                const keywordLines = keywordsSection.split('\n').filter(line => line.trim().startsWith('- '));
                keywordLines.forEach(line => {
                  const keyword = line.replace(/^\s*-\s*/, '').trim();
                  if (keyword) allTags.add(keyword);
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('Error loading posts for tag testing:', error);
        allTags = new Set();
      }
    });

    test('should have tags to test', () => {
      expect(allTags.size).toBeGreaterThan(0);
    });

    if (allTags && allTags.size > 0) {
      Array.from(allTags).forEach(tag => {
        test(`should return 200 for tag page: ${tag}`, async () => {
          const encodedTag = encodeURIComponent(tag);
          const response = await fetch(`${baseUrl}/blog/tag/${encodedTag}`);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe('OK');
        });
      });
    } else {
      test('should have tags to test', () => {
        expect(allTags).toBeDefined();
        expect(allTags.size).toBeGreaterThan(0);
      });
    }
  });

  // Test specific known articles that were recently added
  describe('Recently Added Articles', () => {
    const recentArticles = [
      'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration',
      'the-power-of-flat-files-in-blogging-repurposing-coding-tools-for-content-creation-and-ai-optimization',
      'building-an-effective-web-presence-for-professional-validation',
      'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom'
    ];

    recentArticles.forEach(article => {
      test(`should return 200 for recently added article: ${article}`, async () => {
        const response = await fetch(`${baseUrl}/blog/${article}`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
      });
    });
  });

  // Test specific known tags that should exist
  describe('Known Tag Pages', () => {
    const knownTags = [
      'web-development',
      'automation',
      'AI',
      'career-development',
      'freelance',
      'technology',
      'programming',
      'SEO',
      'blogging',
      'startup'
    ];

    knownTags.forEach(tag => {
      test(`should return 200 for known tag: ${tag}`, async () => {
        const encodedTag = encodeURIComponent(tag);
        const response = await fetch(`${baseUrl}/blog/tag/${encodedTag}`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
      });
    });
  });

  // Test content validation
  describe('Content Validation', () => {
    test('home page should contain expected content', async () => {
      const response = await fetch(`${baseUrl}/`);
      const html = await response.text();
      
      expect(html).toContain('CyberWorld Builders');
      expect(response.status).toBe(200);
    });

    test('blog index should contain post listings', async () => {
      const response = await fetch(`${baseUrl}/blog`);
      const html = await response.text();
      
      expect(html).toContain('Blog');
      expect(response.status).toBe(200);
    });

    test('tags index should contain tag listings', async () => {
      const response = await fetch(`${baseUrl}/blog/tags`);
      const html = await response.text();
      
      expect(html).toContain('Tags');
      expect(response.status).toBe(200);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should return 404 for non-existent blog post', async () => {
      const response = await fetch(`${baseUrl}/blog/non-existent-post`);
      expect(response.status).toBe(404);
    });

    test('should return 404 for non-existent tag', async () => {
      const response = await fetch(`${baseUrl}/blog/tag/non-existent-tag`);
      expect(response.status).toBe(404);
    });
  });
});
