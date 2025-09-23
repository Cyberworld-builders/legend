/**
 * Build Validation Test Suite
 * 
 * This test suite validates that the build process works correctly
 * and that all required files and configurations are in place.
 * This can run in CI without requiring a running server.
 */

const fs = require('fs');
const path = require('path');

describe('Build Validation', () => {
  // Test that required files exist
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

  // Test that blog posts exist
  describe('Blog Posts', () => {
    test('should have blog posts directory', () => {
      const postsDir = path.join('app', 'blog', 'posts', 'markdown');
      expect(fs.existsSync(postsDir)).toBe(true);
    });

    test('should have blog posts', () => {
      const postsDir = path.join('app', 'blog', 'posts', 'markdown');
      const files = fs.readdirSync(postsDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      expect(mdFiles.length).toBeGreaterThan(0);
    });

    test('should have the problematic article', () => {
      const articlePath = path.join('app', 'blog', 'posts', 'markdown', 'building-a-generative-framework-evolving-ai-coding-agents-and-human-ai-collaboration.md');
      expect(fs.existsSync(articlePath)).toBe(true);
    });
  });

  // Test that components exist
  describe('Components', () => {
    test('should have PageBackground component', () => {
      expect(fs.existsSync('components/PageBackground.tsx')).toBe(true);
    });

    test('should have Article component', () => {
      expect(fs.existsSync('components/Article.tsx')).toBe(true);
    });

    test('should have TopicClusters component', () => {
      expect(fs.existsSync('components/TopicClusters.tsx')).toBe(true);
    });
  });

  // Test that pages exist
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

    test('should have tag pages', () => {
      expect(fs.existsSync('app/blog/tag/[tag]/page.tsx')).toBe(true);
      expect(fs.existsSync('app/blog/tags/page.tsx')).toBe(true);
    });

    test('should have sitemap', () => {
      expect(fs.existsSync('app/sitemap.ts')).toBe(true);
    });
  });

  // Test that assets exist
  describe('Assets', () => {
    test('should have background image', () => {
      expect(fs.existsSync('public/images/article-background-circuits.png')).toBe(true);
    });

    test('should have logo', () => {
      expect(fs.existsSync('public/images/logo.png')).toBe(true);
    });

    test('should have robots.txt', () => {
      expect(fs.existsSync('public/robots.txt')).toBe(true);
    });
  });

  // Test package.json scripts
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

  // Test that markdown files have frontmatter
  describe('Markdown Frontmatter', () => {
    test('should have frontmatter in blog posts', () => {
      const postsDir = path.join('app', 'blog', 'posts', 'markdown');
      const files = fs.readdirSync(postsDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      
      mdFiles.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for frontmatter
        expect(content).toMatch(/^---\n/);
        expect(content).toMatch(/\n---\n/);
        
        // Check for required fields
        expect(content).toMatch(/title:/);
        expect(content).toMatch(/description:/);
      });
    });
  });
});
