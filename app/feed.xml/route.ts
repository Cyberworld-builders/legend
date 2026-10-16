import { loadPosts } from '@/lib/posts';

const SITE_URL = 'https://cyberworldbuilders.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822Date(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00Z`);
  return date.toUTCString();
}

export async function GET() {
  const posts = loadPosts()
    .filter((post) => !post.meta.isDraft)
    .sort((a, b) => new Date(b.meta.publishedDate).getTime() - new Date(a.meta.publishedDate).getTime());

  const items = posts.map((post) => {
    const { meta } = post;
    const link = `${SITE_URL}/blog/${meta.slug}`;
    const categoryXml = meta.category
      ? `<category>${escapeXml(meta.category)}</category>`
      : '';

    return `    <item>
      <title>${escapeXml(meta.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(meta.description)}</description>
      <pubDate>${formatRfc822Date(meta.publishedDate)}</pubDate>
      <guid isPermaLink="true">${link}</guid>
      ${categoryXml}
    </item>`;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CyberWorld Builders - Field Notes</title>
    <link>${SITE_URL}/blog</link>
    <description>Technical insights on AI agents, software engineering, automation, SEO, and building systems for service businesses.</description>
    <language>en-us</language>
    <lastBuildDate>${formatRfc822Date(posts[0]?.meta.publishedDate || new Date().toISOString().slice(0, 10))}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>contact@cyberworldbuilders.com (Jay Long)</managingEditor>
    <webMaster>contact@cyberworldbuilders.com (Jay Long)</webMaster>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
