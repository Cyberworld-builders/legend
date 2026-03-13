import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedPosts from '@/components/RelatedPosts';
import SocialShare from '@/components/SocialShare';
import PageBackground from '@/components/PageBackground';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllPosts } from '@/lib/post-metadata';
import { slugifyTag } from '@/lib/tag-utils';
import type { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

// SSG + ISR: pre-render at build, revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: 'Blog Post Not Found', description: 'The requested blog post could not be found.' };
  }

  const { metadata } = post;
  const title = metadata.title;
  const description = metadata.description || `${title} — an engineer's take on building real software. From CyberWorld Builders.`;
  const url = metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}`;
  const ogParams = new URLSearchParams({ title });
  if (description) ogParams.set('description', description);
  const dynamicOgImage = `https://cyberworldbuilders.com/api/og?${ogParams.toString()}`;
  const headerImageUrl = metadata.headerImage?.trim()
    ? `https://cyberworldbuilders.com${metadata.headerImage}`
    : null;
  const socialImage = metadata.socialImage?.trim() || headerImageUrl || dynamicOgImage;

  return {
    title,
    description,
    keywords: metadata.keywords,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: metadata.publishedDate,
      modifiedTime: metadata.modifiedDate,
      authors: [metadata.author?.name || 'Jay Long'],
      siteName: 'CyberWorld Builders',
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
    alternates: { canonical: url },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { metadata, Component } = post;
  const title = metadata.title;
  const description = metadata.description || `${title} — an engineer's take on building real software. From CyberWorld Builders.`;

  // Build allPosts list for related posts and navigation
  const allPostEntries = getAllPosts();
  const allPosts = allPostEntries.map(p => ({
    slug: p.slug,
    title: p.title,
    mtime: new Date(p.publishedDate),
    metadata: {
      topics: p.topics,
      tags: p.tags,
      category: p.category,
    },
    headerImage: p.headerImage || '',
  }));

  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

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

        {/* Breadcrumb */}
        <div className="w-full max-w-3xl mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: title },
            ]}
          />
        </div>

        {/* Header Image */}
        {metadata.headerImage && metadata.headerImage.trim() !== '' && (
          <div className="w-full max-w-4xl mb-8">
            <Image
              src={metadata.headerImage}
              alt={title}
              width={1200}
              height={630}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            />
          </div>
        )}

        {/* Post title */}
        <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#00ff00]">{title}</h1>
        </div>

        {/* Author + date info */}
        <div className="w-full max-w-3xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00ff00]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#00ff00] text-sm font-bold">JL</span>
                </div>
                <div>
                  <p className="text-[#00ff00] font-medium">Jay Long</p>
                  <p className="text-[#00ff00]/70 text-sm">Software Engineer &amp; Founder</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-[#00ff00]/70 text-sm">
                Published {new Date(metadata.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {metadata.modifiedDate && metadata.modifiedDate !== metadata.publishedDate && (
                <p className="text-[#00ff00]/50 text-xs">
                  Updated {new Date(metadata.modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BlogPosting Schema — more specific than Article, unlocks richer SERP results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: title,
              description,
              image: metadata.socialImage || "https://cyberworldbuilders.com/images/logo.png",
              author: {
                "@type": "Person",
                name: "Jay Long",
                url: "https://cyberworldbuilders.com",
                sameAs: [
                  "https://github.com/CyberWorld-builders",
                  "https://youtube.com/@cyberbuilders",
                  "https://x.com/cyberbuilders",
                  "https://www.facebook.com/cyberworldbuilders",
                  "https://www.upwork.com/freelancers/jaylongcyberworld",
                ],
              },
              publisher: {
                "@type": "Organization",
                name: "CyberWorld Builders",
                logo: { "@type": "ImageObject", url: "https://cyberworldbuilders.com/images/logo.png", width: 250, height: 250 },
              },
              datePublished: metadata.publishedDate,
              dateModified: metadata.modifiedDate || metadata.publishedDate,
              mainEntityOfPage: { "@type": "WebPage", "@id": metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}` },
              url: metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}`,
              articleSection: metadata.category || "Technology",
              keywords: metadata.keywords || [],
              inLanguage: metadata.language || "en-US",
            }),
          }}
        />

        {/* Post content — rendered directly as JSX */}
        <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto w-full">
          <div className="prose prose-invert max-w-none">
            <Component />
          </div>
        </div>

        {/* Tags */}
        {((metadata.tags && metadata.tags.length > 0) || (metadata.keywords && metadata.keywords.length > 0)) && (
          <div className="w-full max-w-3xl mt-8">
            <div className="border-t border-[#00ff00]/20 pt-6">
              <h3 className="text-lg font-semibold text-[#00ff00] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(metadata.tags || metadata.keywords || []).map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${slugifyTag(tag)}`}
                    className="px-3 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full text-sm text-[#00ff00]/80 hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors cursor-pointer"
                    title={`Filter by ${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Sharing */}
        <div className="w-full max-w-3xl">
          <SocialShare
            url={`https://cyberworldbuilders.com/blog/${slug}`}
            title={title}
            description={description}
          />
        </div>

        {/* Related Posts */}
        <div className="w-full max-w-3xl">
          <RelatedPosts currentSlug={slug} allPosts={allPosts} />
        </div>

        {/* Post Navigation */}
        <div className="mt-8 flex justify-between w-full max-w-2xl">
          {prevPost && (
            <Link href={`/blog/${prevPost.slug}`} className="text-[#00ff00] hover:text-[#00cc00] hover:underline">
              &larr; {prevPost.title}
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="text-[#00ff00] hover:text-[#00cc00] hover:underline">
              {nextPost.title} &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
