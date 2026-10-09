/**
 * Build Validation Test Suite
 *
 * Validates that the build process works correctly
 * and that all required files and configurations are in place.
 */

const fs = require('fs');
const path = require('path');

describe('Build Validation', () => {
  describe('Required Files', () => {
    test('should have package.json', () => {
      expect(fs.existsSync('package.json')).toBe(true);
    });

    test('should have next.config.js', () => {
      expect(fs.existsSync('next.config.js')).toBe(true);
    });

    test('should have tailwind.config.js', () => {
      expect(fs.existsSync('tailwind.config.js')).toBe(true);
    });

    test('should have jest.config.js', () => {
      expect(fs.existsSync('jest.config.js')).toBe(true);
    });

    test('should have vercel.json', () => {
      expect(fs.existsSync('vercel.json')).toBe(true);
    });
  });

  describe('Blog Posts', () => {
    test('should have blog content directory', () => {
      expect(fs.existsSync(path.join('content', 'blog'))).toBe(true);
    });

    test('every post should have valid frontmatter matching its filename', () => {
      const matter = require('gray-matter');
      const dir = path.join('content', 'blog');
      const files = fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) {
        const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
        for (const key of ['title', 'description', 'slug', 'publishedDate']) {
          expect([file, key, Boolean(data[key])]).toEqual([file, key, true]);
        }
        expect([file, data.slug]).toEqual([file, file.replace(/\.mdx$/, '')]);
        expect([file, content.trim().length > 0]).toEqual([file, true]);
      }
    });
  });

  describe('Components', () => {
    test('should have PageBackground component', () => {
      expect(fs.existsSync('components/PageBackground.tsx')).toBe(true);
    });

    test('should have TopicClusters component', () => {
      expect(fs.existsSync('components/TopicClusters.tsx')).toBe(true);
    });
  });

  describe('Pages', () => {
    test('should have home page', () => {
      expect(fs.existsSync('app/page.tsx')).toBe(true);
    });

    test('should have blog index page', () => {
      expect(fs.existsSync('app/blog/page.tsx')).toBe(true);
    });

    test('should have blog slug page', () => {
      expect(fs.existsSync('app/blog/[slug]/page.tsx')).toBe(true);
    });

    test('should have tags hub page', () => {
      expect(fs.existsSync('app/blog/tags/page.tsx')).toBe(true);
    });

    test('should have sitemap', () => {
      expect(fs.existsSync('app/sitemap.ts')).toBe(true);
    });
  });

  describe('Assets', () => {
    test('should have background image', () => {
      expect(fs.existsSync('public/images/article-background-circuits.webp')).toBe(true);
    });

    test('should have logo', () => {
      expect(fs.existsSync('public/images/logo.png')).toBe(true);
    });

    test('should have robots.txt route handler', () => {
      expect(fs.existsSync('app/robots.ts')).toBe(true);
    });
  });

  describe('Package Scripts', () => {
    let packageJson;

    beforeAll(() => {
      packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    });

    test('should have test script', () => {
      expect(packageJson.scripts.test).toBeDefined();
    });

    test('should have build script', () => {
      expect(packageJson.scripts.build).toBeDefined();
    });

    test('should have lint script', () => {
      expect(packageJson.scripts.lint).toBeDefined();
    });

    test('should have test:ci script', () => {
      expect(packageJson.scripts['test:ci']).toBeDefined();
    });
  });

});
