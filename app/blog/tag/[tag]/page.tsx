import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import PageBackground from '@/components/PageBackground';
import { getAllPosts } from '@/lib/post-metadata';
import type { PostIndexEntry } from '@/lib/post-metadata';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

function getPostsForTag(tag: string): PostIndexEntry[] {
  const decoded = decodeURIComponent(tag);
  return getAllPosts().filter(
    (p) => p.tags.includes(decoded) || p.keywords.includes(decoded)
  );
}

function getAllUniqueTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const t of post.tags) tags.add(t);
    for (const k of post.keywords) tags.add(k);
  }
  return Array.from(tags);
}

export async function generateStaticParams() {
  return getAllUniqueTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsForTag(tag);
  const title = `Posts tagged "${decoded}" — CyberWorld Builders Blog`;
  const description = `Browse ${posts.length} blog post${posts.length === 1 ? '' : 's'} tagged with "${decoded}" — Software engineering insights from CyberWorld Builders.`;
  const canonical = `https://cyberworldbuilders.com/blog/tag/${encodeURIComponent(decoded)}`;

  return {
    title,
    description,
    openGraph: { title, description, url: canonical, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsForTag(tag);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
      <PageBackground opacity={20} fullWidth={true} />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src="/icons/favicon.ico"
              alt="CyberWorld Builders - Software Engineering & Consulting Services"
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
              loading="lazy"
            />
          </Link>
        </div>

        <div className="w-full max-w-2xl mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Tags', href: '/blog/tags' },
              { label: `#${decoded}` },
            ]}
          />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-[#00ff00]">
          #{decoded}
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
                </p>
                {post.description && (
                  <p className="text-[#00ff00]/70 mt-2 text-sm">{post.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.slice(0, 5).map((t) => (
                    <Link
                      key={t}
                      href={`/blog/tag/${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded-full text-xs text-[#00ff00]/60 hover:text-[#00ff00] transition-colors"
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
