/**
 * Cemetery Software Landing Page Tests
 *
 * Validates that the cemetery software page files exist,
 * contain required SEO metadata, JSON-LD schemas, and expected content.
 */

const fs = require('fs');
const path = require('path');

const PAGE_PATH = path.join('app', 'cemetery-software', 'page.tsx');
const CONTENT_PATH = path.join('app', 'cemetery-software', 'CemeteryContent.tsx');

describe('Cemetery Software Landing Page', () => {
  describe('File Structure', () => {
    test('should have page.tsx', () => {
      expect(fs.existsSync(PAGE_PATH)).toBe(true);
    });

    test('should have CemeteryContent.tsx', () => {
      expect(fs.existsSync(CONTENT_PATH)).toBe(true);
    });
  });

  describe('SEO Metadata (page.tsx)', () => {
    let pageContent;

    beforeAll(() => {
      pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
    });

    test('should export metadata object', () => {
      expect(pageContent).toContain('export const metadata: Metadata');
    });

    test('should have title with cemetery keywords', () => {
      expect(pageContent).toContain('Cemetery Management Software');
    });

    test('should have meta description', () => {
      expect(pageContent).toMatch(/description.*cemetery management software/is);
    });

    test('should have canonical URL', () => {
      expect(pageContent).toContain(
        'https://cyberworldbuilders.com/cemetery-software'
      );
    });

    test('should have Open Graph metadata', () => {
      expect(pageContent).toContain('openGraph');
    });

    test('should have Twitter card metadata', () => {
      expect(pageContent).toContain('twitter');
    });

    test('should have keywords array', () => {
      expect(pageContent).toContain('cemetery software');
      expect(pageContent).toContain('grave locator');
      expect(pageContent).toContain('memorial park software');
    });
  });

  describe('JSON-LD Schemas (page.tsx)', () => {
    let pageContent;

    beforeAll(() => {
      pageContent = fs.readFileSync(PAGE_PATH, 'utf8');
    });

    test('should have SoftwareApplication schema', () => {
      expect(pageContent).toContain("'@type': 'SoftwareApplication'");
    });

    test('should reference EternaGuard as the product', () => {
      expect(pageContent).toContain('EternaGuard');
    });

    test('should reference CyberWorld Builders as provider', () => {
      expect(pageContent).toContain('CyberWorld Builders');
    });

    test('should have feature list in schema', () => {
      expect(pageContent).toContain('featureList');
      expect(pageContent).toContain('GPS Plot Navigation');
    });

    test('should render JSON-LD script tag', () => {
      expect(pageContent).toContain('application/ld+json');
    });
  });

  describe('Page Content (CemeteryContent.tsx)', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should be a client component', () => {
      expect(contentFile.trimStart().startsWith("'use client'")).toBe(true);
    });

    test('should import PageBackground', () => {
      expect(contentFile).toContain("from '@/components/PageBackground'");
    });

    test('should import Breadcrumb', () => {
      expect(contentFile).toContain("from '@/components/Breadcrumb'");
    });

    test('should import ContactForm', () => {
      expect(contentFile).toContain("from '@/components/ContactForm'");
    });

    test('should import ScrollTracker dynamically', () => {
      expect(contentFile).toContain("import('@/components/ScrollTracker')");
    });

    test('should import TurnstileField', () => {
      expect(contentFile).toContain("from '@/components/TurnstileField'");
    });
  });

  describe('Required Sections', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should have hero section', () => {
      expect(contentFile).toContain('id="hero"');
    });

    test('should have problem section', () => {
      expect(contentFile).toContain('id="problem"');
    });

    test('should have features section', () => {
      expect(contentFile).toContain('id="features"');
    });

    test('should have demo section', () => {
      expect(contentFile).toContain('id="demo"');
    });

    test('should have why-us section', () => {
      expect(contentFile).toContain('id="why-us"');
    });

    test('should have faq section', () => {
      expect(contentFile).toContain('id="faq"');
    });

    test('should have contact section', () => {
      expect(contentFile).toContain('id="contact"');
    });

    test('should track all sections in ScrollTracker', () => {
      const sections = ['hero', 'problem', 'features', 'demo', 'why-us', 'faq', 'contact'];
      sections.forEach((section) => {
        expect(contentFile).toContain(`'${section}'`);
      });
    });
  });

  describe('Lead Capture', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should have email input in hero', () => {
      expect(contentFile).toContain('type="email"');
    });

    test('should submit to leads API', () => {
      expect(contentFile).toContain('/api/leads/submit');
    });

    test('should track hero email CTA events', () => {
      expect(contentFile).toContain('cemetery_hero_email');
    });

    test('should track demo CTA click', () => {
      expect(contentFile).toContain('cemetery_demo');
    });
  });

  describe('Demo & Blog Links', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should link to EternaGuard demo', () => {
      expect(contentFile).toContain(
        'https://eternaguard.cyberworldbuilders.com'
      );
    });

    test('should open demo in new tab', () => {
      expect(contentFile).toContain('target="_blank"');
      expect(contentFile).toContain('noopener noreferrer');
    });

    test('should link to cemetery blog post', () => {
      expect(contentFile).toContain(
        '/blog/cemetery-management-application-gps-mapping-ar-integration-and-autonomous-maintenance-for-funeral-homes'
      );
    });
  });

  describe('FAQ Content', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should have FAQPage JSON-LD schema', () => {
      expect(contentFile).toContain("'@type': 'FAQPage'");
    });

    test('should have 7 FAQ questions', () => {
      const questionMatches = contentFile.match(/question:/g);
      expect(questionMatches).toHaveLength(7);
    });

    test('should have accordion toggle functionality', () => {
      expect(contentFile).toContain('toggleFaq');
      expect(contentFile).toContain('aria-expanded');
    });
  });

  describe('Alternating Section Backgrounds', () => {
    let contentFile;

    beforeAll(() => {
      contentFile = fs.readFileSync(CONTENT_PATH, 'utf8');
    });

    test('should have dark background sections', () => {
      expect(contentFile).toContain('bg-[#0a0a0a]');
    });

    test('should use terminal green styling', () => {
      expect(contentFile).toContain('#00ff00');
    });
  });

  describe('Sitemap Entry', () => {
    test('sitemap should include cemetery-software', () => {
      const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
      expect(sitemapContent).toContain('/cemetery-software');
    });

    test('sitemap should have priority 0.9 for cemetery page', () => {
      const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
      const cemeterySection = sitemapContent.substring(
        sitemapContent.indexOf('cemetery-software')
      );
      expect(cemeterySection).toContain('0.9');
    });
  });
});
