const fs = require('fs');
const path = require('path');

describe('RSS Feed', () => {
  const feedRoutePath = path.join(process.cwd(), 'app', 'feed.xml', 'route.ts');
  const rssRoutePath = path.join(process.cwd(), 'app', 'rss.xml', 'route.ts');
  const postsDir = path.join(process.cwd(), 'content', 'blog');

  test('feed.xml route file exists', () => {
    expect(fs.existsSync(feedRoutePath)).toBe(true);
  });

  test('rss.xml redirect route file exists', () => {
    expect(fs.existsSync(rssRoutePath)).toBe(true);
  });

  test('feed.xml route exports GET handler', () => {
    const content = fs.readFileSync(feedRoutePath, 'utf8');
    expect(content).toContain('export async function GET');
  });

  test('feed.xml route generates valid RSS 2.0 structure', () => {
    const content = fs.readFileSync(feedRoutePath, 'utf8');
    expect(content).toContain('<?xml version="1.0"');
    expect(content).toContain('<rss version="2.0"');
    expect(content).toContain('<channel>');
    expect(content).toContain('<title>');
    expect(content).toContain('<link>');
    expect(content).toContain('<description>');
    expect(content).toContain('<item>');
    expect(content).toContain('<pubDate>');
    expect(content).toContain('<guid');
  });

  test('feed.xml route filters out draft posts', () => {
    const content = fs.readFileSync(feedRoutePath, 'utf8');
    expect(content).toContain("!post.meta.isDraft");
  });

  test('feed.xml route sorts by date descending (newest first)', () => {
    const content = fs.readFileSync(feedRoutePath, 'utf8');
    expect(content).toContain('new Date(b.meta.publishedDate).getTime() - new Date(a.meta.publishedDate).getTime()');
  });

  test('rss.xml redirects to feed.xml', () => {
    const content = fs.readFileSync(rssRoutePath, 'utf8');
    expect(content).toContain("redirect('/feed.xml')");
  });

  test('layout includes RSS alternate link', () => {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');
    expect(content).toContain('application/rss+xml');
    expect(content).toContain('feed.xml');
  });

  test('llms.txt mentions RSS feed', () => {
    const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
    const content = fs.readFileSync(llmsPath, 'utf8');
    expect(content).toContain('feed.xml');
  });

  test('at least 10 non-draft blog posts exist for the feed', () => {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
    let nonDraftCount = 0;
    for (const file of files) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      if (!content.includes('isDraft: true')) {
        nonDraftCount++;
      }
    }
    expect(nonDraftCount).toBeGreaterThanOrEqual(10);
  });
});
