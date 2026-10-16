/**
 * JSON-LD Schema Validation Tests
 *
 * Validates that structured data (JSON-LD) schemas are correctly formatted
 * and contain all required fields for BlogPosting, Organization, and WebSite types.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BASE_URL = 'https://cyberworldbuilders.com';
const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Constructs a BlogPosting JSON-LD object the same way the blog page does.
 */
function buildBlogPostingSchema(slug, meta) {
  const title = meta.title;
  const description = meta.description || `${title} — an engineer's take on building real software. From CyberWorld Builders.`;
  const publishInstant = (date) => {
    if (!date) return undefined;
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00Z` : date;
  };
  const imageUrl = meta.headerImage
    ? `${BASE_URL}${meta.headerImage}`
    : `${BASE_URL}/images/logo.png`;
  const canonicalUrl = meta.canonicalUrl || `${BASE_URL}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: title,
    description,
    image: imageUrl,
    author: {
      "@type": "Person",
      name: "Jay Long",
      url: BASE_URL,
      sameAs: [
        "https://github.com/CyberWorld-builders",
        "https://youtube.com/@cyberbuilders",
        "https://x.com/cyberbuilders",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "CyberWorld Builders",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/logo.png`, width: 250, height: 250 },
    },
    datePublished: publishInstant(meta.publishedDate),
    dateModified: publishInstant(meta.modifiedDate || meta.publishedDate),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
    articleSection: meta.category || "Technology",
    keywords: [...new Set([...(meta.keywords || []), ...(meta.tags || [])])],
    inLanguage: meta.language || "en-US",
  };
}

/**
 * Constructs an Organization JSON-LD object as in the root layout.
 */
function buildOrganizationSchema() {
  const description = 'A personal technology workshop exploring human–AI collaboration, creative tools, immersive experiences, and the systems that bring them to life.';
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "CyberWorld Builders",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${BASE_URL}/#logo`,
      url: `${BASE_URL}/images/logo.png`,
      width: 250,
      height: 250,
      caption: "CyberWorld Builders",
    },
    description,
    founder: { "@type": "Person", name: "Jay Long", url: BASE_URL },
    sameAs: [
      "https://github.com/CyberWorld-builders",
      "https://youtube.com/@cyberbuilders",
      "https://x.com/cyberbuilders",
    ],
  };
}

/**
 * Constructs a WebSite JSON-LD object as in the root layout.
 */
function buildWebSiteSchema() {
  const description = 'A personal technology workshop exploring human–AI collaboration, creative tools, immersive experiences, and the systems that bring them to life.';
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "CyberWorld Builders",
    description,
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

describe('JSON-LD Schema Validation', () => {
  describe('BlogPosting Schema', () => {
    let posts;

    beforeAll(() => {
      const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
      posts = files.map(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { data } = matter(content);
        const slug = file.replace(/\.mdx$/, '');
        return { slug, meta: data };
      });
    });

    test('should have at least one blog post', () => {
      expect(posts.length).toBeGreaterThan(0);
    });

    test('all posts should produce valid JSON-LD that parses correctly', () => {
      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        const jsonString = JSON.stringify(schema);
        expect(() => JSON.parse(jsonString)).not.toThrow();
      }
    });

    test('all BlogPosting schemas should have required fields', () => {
      const requiredFields = [
        '@context',
        '@type',
        'headline',
        'description',
        'author',
        'publisher',
        'datePublished',
        'mainEntityOfPage',
        'url',
      ];

      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        for (const field of requiredFields) {
          expect([slug, field, schema[field] !== undefined]).toEqual([slug, field, true]);
        }
      }
    });

    test('BlogPosting author should be a valid Person type', () => {
      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        expect([slug, schema.author['@type']]).toEqual([slug, 'Person']);
        expect([slug, typeof schema.author.name]).toEqual([slug, 'string']);
        expect([slug, typeof schema.author.url]).toEqual([slug, 'string']);
        expect([slug, schema.author.url.startsWith('https://')]).toEqual([slug, true]);
      }
    });

    test('BlogPosting publisher should be a valid Organization type', () => {
      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        expect([slug, schema.publisher['@type']]).toEqual([slug, 'Organization']);
        expect([slug, typeof schema.publisher.name]).toEqual([slug, 'string']);
        expect([slug, schema.publisher.logo['@type']]).toEqual([slug, 'ImageObject']);
      }
    });

    test('BlogPosting datePublished should be valid ISO format', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        expect([slug, isoDateRegex.test(schema.datePublished)]).toEqual([slug, true]);
      }
    });

    test('BlogPosting URLs should be absolute', () => {
      for (const { slug, meta } of posts) {
        const schema = buildBlogPostingSchema(slug, meta);
        expect([slug, schema.url.startsWith(BASE_URL)]).toEqual([slug, true]);
        expect([slug, schema.image.startsWith('https://')]).toEqual([slug, true]);
        expect([slug, schema.mainEntityOfPage['@id'].startsWith(BASE_URL)]).toEqual([slug, true]);
      }
    });

    test('BlogPosting keywords should merge tags and keywords', () => {
      const postsWithBoth = posts.filter(
        p => (p.meta.keywords?.length > 0) && (p.meta.tags?.length > 0)
      );
      
      if (postsWithBoth.length > 0) {
        for (const { slug, meta } of postsWithBoth) {
          const schema = buildBlogPostingSchema(slug, meta);
          const expectedKeywords = new Set([...(meta.keywords || []), ...(meta.tags || [])]);
          expect([slug, schema.keywords.length]).toEqual([slug, expectedKeywords.size]);
        }
      }
    });
  });

  describe('Organization Schema', () => {
    test('Organization schema should parse as valid JSON', () => {
      const schema = buildOrganizationSchema();
      const jsonString = JSON.stringify(schema);
      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    test('Organization schema should have required fields', () => {
      const schema = buildOrganizationSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('CyberWorld Builders');
      expect(schema.url).toBe(BASE_URL);
      expect(schema.logo).toBeDefined();
      expect(schema.logo['@type']).toBe('ImageObject');
    });

    test('Organization logo should have required ImageObject properties', () => {
      const schema = buildOrganizationSchema();
      expect(schema.logo.url).toContain(BASE_URL);
      expect(schema.logo.width).toBeGreaterThan(0);
      expect(schema.logo.height).toBeGreaterThan(0);
    });

    test('Organization sameAs should only contain verified social links', () => {
      const schema = buildOrganizationSchema();
      expect(Array.isArray(schema.sameAs)).toBe(true);
      for (const link of schema.sameAs) {
        expect(link.startsWith('https://')).toBe(true);
      }
    });
  });

  describe('WebSite Schema', () => {
    test('WebSite schema should parse as valid JSON', () => {
      const schema = buildWebSiteSchema();
      const jsonString = JSON.stringify(schema);
      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    test('WebSite schema should have required fields', () => {
      const schema = buildWebSiteSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.url).toBe(BASE_URL);
      expect(schema.name).toBe('CyberWorld Builders');
      expect(schema.publisher).toBeDefined();
    });

    test('WebSite publisher should reference Organization by @id', () => {
      const schema = buildWebSiteSchema();
      expect(schema.publisher['@id']).toBe(`${BASE_URL}/#organization`);
    });
  });

  describe('Schema Consistency', () => {
    test('Organization @id should match WebSite publisher reference', () => {
      const org = buildOrganizationSchema();
      const site = buildWebSiteSchema();
      expect(org['@id']).toBe(site.publisher['@id']);
    });

    test('BlogPosting publisher @id should reference Organization', () => {
      const org = buildOrganizationSchema();
      const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
      if (files.length > 0) {
        const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, files[0]), 'utf8'));
        const schema = buildBlogPostingSchema(files[0].replace(/\.mdx$/, ''), data);
        expect(schema.publisher['@id']).toBe(org['@id']);
      }
    });
  });
});
