import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageBackground from '@/components/PageBackground';
import { getAllPosts } from '@/lib/post-metadata';
import type { PostIndexEntry } from '@/lib/post-metadata';
import { slugifyTag, getTagDisplayName, getAllTagSlugs, getPostCountForTag } from '@/lib/tag-utils';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

function getPostsForSlug(slug: string): PostIndexEntry[] {
  return getAllPosts().filter(
    (p) =>
      p.tags.some((t) => slugifyTag(t) === slug) ||
      p.keywords.some((k) => slugifyTag(k) === slug)
  );
}

export async function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const displayName = getTagDisplayName(tag);
  const posts = getPostsForSlug(tag);
  const title = `Posts tagged "${displayName}" — CyberWorld Builders Blog`;
  const description = `Browse ${posts.length} blog post${posts.length === 1 ? '' : 's'} tagged with "${displayName}" — Software engineering insights from CyberWorld Builders.`;
  const canonical = `https://cyberworldbuilders.com/blog/tag/${tag}`;

  const MIN_POSTS_FOR_INDEX = 3;
  const postCount = getPostCountForTag(tag);

  return {
    title,
    description,
    ...(postCount < MIN_POSTS_FOR_INDEX && {
      robots: { index: false, follow: true },
    }),
    openGraph: { title, description, url: canonical, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const displayName = getTagDisplayName(tag);
  const posts = getPostsForSlug(tag);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
      <PageBackground opacity={20} fullWidth={true} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full max-w-2xl mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Tags', href: '/blog/tags' },
              { label: `#${displayName}` },
            ]}
          />
        </div>

        {/* CollectionPage Schema with freshness signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `Posts tagged "${displayName}" — CyberWorld Builders Blog`,
              description: `Browse ${posts.length} blog post${posts.length === 1 ? '' : 's'} tagged with "${displayName}".`,
              url: `https://cyberworldbuilders.com/blog/tag/${tag}`,
              dateModified: posts.length > 0
                ? posts.reduce((latest, p) => {
                    const d = new Date(p.modifiedDate || p.publishedDate);
                    return d > latest ? d : latest;
                  }, new Date(posts[0].modifiedDate || posts[0].publishedDate)).toISOString()
                : new Date().toISOString(),
              publisher: {
                "@type": "Organization",
                name: "CyberWorld Builders",
                logo: { "@type": "ImageObject", url: "https://cyberworldbuilders.com/images/logo.png" },
              },
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: posts.length,
                itemListElement: posts.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://cyberworldbuilders.com/blog/${p.slug}`,
                  name: p.title,
                })),
              },
            }),
          }}
        />

        <h1 className="text-4xl font-bold mb-2 text-[#00ff00]">
          #{displayName}
        </h1>
        <p className="text-[#00ff00]/70 mb-8">
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </p>

        <div className="w-full max-w-2xl">
          {posts.length === 0 ? (
            <p className="text-[#00ff00]/70 text-center">No posts found for this tag.</p>
          ) : (
            posts.map((post) => (
              <div key={post.slug} className="mb-6 border-b border-[#00ff00]/10 pb-6">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-2xl text-[#00ff00] hover:text-[#00cc00] hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-[#00ff00]/50 text-sm mt-1">
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {post.modifiedDate && post.modifiedDate !== post.publishedDate && (
                    <span className="text-[#00ff00]/30 ml-2">
                      · Updated {new Date(post.modifiedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </p>
                {post.description && (
                  <p className="text-[#00ff00]/70 mt-2 text-sm">{post.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.slice(0, 5).map((t) => (
                    <Link
                      key={t}
                      href={`/blog/tag/${slugifyTag(t)}`}
                      className="px-3 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded-full text-xs text-[#00ff00]/60 hover:text-[#00ff00] transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/blog/tags"
            className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors"
          >
            All Tags
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors"
          >
            All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
