
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import TopicClusters from '@/components/TopicClusters';
import PageBackground from '@/components/PageBackground';
import BlogPostList from '@/components/BlogPostList';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import { getAllPosts, getAllPostsWithMetadata, getFeaturedPosts } from '@/lib/post-metadata';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 5;

export async function generateMetadata({
  searchParams,
}: BlogIndexProps): Promise<Metadata> {
  const { tag: tagFilter } = await searchParams;
  const baseUrl = 'https://cyberworldbuilders.com';
  const canonical = tagFilter
    ? `${baseUrl}/blog?tag=${encodeURIComponent(tagFilter)}`
    : `${baseUrl}/blog`;

  if (tagFilter) {
    return {
      title: `Posts tagged with "${tagFilter}" - CyberWorld Builders Blog`,
      description: `Browse blog posts tagged with "${tagFilter}" - Software engineering insights and technical articles from CyberWorld Builders.`,
      openGraph: {
        title: `Posts tagged with "${tagFilter}" - CyberWorld Builders Blog`,
        description: `Browse blog posts tagged with "${tagFilter}".`,
        url: canonical,
        type: 'website',
      },
      alternates: { canonical },
    };
  }

  return {
    title: 'Blog — Real Engineering, Not AI Fluff',
    description: 'Dispatches from building production software with AI agents, automating SEO pipelines, and running a one-person dev shop. Written by a human who ships.',
    openGraph: {
      title: 'Blog — Real Engineering, Not AI Fluff | CyberWorld Builders',
      description: 'Dispatches from building production software with AI agents, automating SEO pipelines, and running a one-person dev shop. Written by a human who ships.',
      url: canonical,
      type: 'website',
      siteName: 'CyberWorld Builders',
      images: [
        { url: 'https://cyberworldbuilders.com/images/social-card.png', width: 1200, height: 630, alt: 'CyberWorld Builders Blog' },
        { url: 'https://cyberworldbuilders.com/images/logo.png', width: 1200, height: 630, alt: 'CyberWorld Builders Logo' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@cyberbuilders',
      creator: '@cyberbuilders',
      title: 'Blog — Real Engineering, Not AI Fluff | CyberWorld Builders',
      description: 'Dispatches from building production software with AI agents, automating SEO pipelines, and running a one-person dev shop. Written by a human who ships.',
    },
    alternates: { canonical },
  };
}

// SSG + ISR: pre-render at build, revalidate every hour for crawler-friendly fresh HTML
export const revalidate = 3600;

interface BlogIndexProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const { page, tag: tagFilter } = await searchParams;
  const currentPage = Number(page) || 1;

  const featuredPosts = getFeaturedPosts();

  try {
    // Get all posts with metadata (already sorted by published date and priority)
    let allPostsWithMetadata = await getAllPostsWithMetadata();

    // Filter by tag when ?tag= is present (searchParams are already URL-decoded by Next.js)
    if (tagFilter) {
      allPostsWithMetadata = allPostsWithMetadata.filter(
        (post) =>
          (post.metadata.tags && post.metadata.tags.includes(tagFilter)) ||
          (post.metadata.keywords && post.metadata.keywords.includes(tagFilter))
      );
    }
    
    if (!allPostsWithMetadata || allPostsWithMetadata.length === 0) {
      console.error('No posts found in getAllPostsWithMetadata');
      return (
        <div className="min-h-screen flex flex-col items-center py-8">
          <h1 className="text-2xl font-bold mb-4">Blog</h1>
          <p>No blog posts found. Please check the post index.</p>
        </div>
      );
    }
    
    // Convert to the format expected by the component
    // Build a wordCount lookup from the raw index entries
    const indexEntries = getAllPosts();
    const wordCountMap = new Map(indexEntries.map(e => [e.slug, e.wordCount || 0]));

    const allPosts = allPostsWithMetadata.map(post => ({
      slug: post.slug,
      title: post.metadata.title || post.slug
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      mtime: new Date(post.metadata.publishedDate || ''),
      modifiedDate: post.metadata.modifiedDate || post.metadata.publishedDate || '',
      headerImage: post.metadata.headerImage || '',
      description: post.metadata.description || '',
      category: post.metadata.category || '',
      wordCount: wordCountMap.get(post.slug) || 0,
      keywords: post.metadata.keywords || [],
      tags: post.metadata.tags || [],
    }));

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const paginationBase = tagFilter ? `/blog?tag=${encodeURIComponent(tagFilter)}` : '/blog';

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
        {/* Page Background */}
        <PageBackground opacity={20} fullWidth={true} />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 w-full flex flex-col items-center">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-2xl mb-6">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog' }
          ]} 
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-8">
        {tagFilter ? (
          <>Posts tagged with &ldquo;{tagFilter}&rdquo;</>
        ) : (
          'Blog'
        )}
      </h1>

      {tagFilter && (
        <p className="text-[#00ff00]/70 mb-4">
          <Link href="/blog" className="hover:text-[#00ff00] underline">
            ← View all posts
          </Link>
        </p>
      )}
      
      {/* Featured Posts Carousel */}
      {!tagFilter && featuredPosts.length > 0 && (
        <div className="w-full max-w-5xl mb-8">
          <FeaturedCarousel posts={featuredPosts} title="Top Posts" />
        </div>
      )}

      {/* CollectionPage Schema with freshness signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: tagFilter
              ? `Posts tagged with "${tagFilter}" - CyberWorld Builders Blog`
              : "Blog — Real Engineering, Not AI Fluff | CyberWorld Builders",
            description: tagFilter
              ? `Browse blog posts tagged with "${tagFilter}".`
              : "Dispatches from building production software with AI agents, automating SEO pipelines, and running a one-person dev shop.",
            url: tagFilter
              ? `https://cyberworldbuilders.com/blog?tag=${encodeURIComponent(tagFilter)}`
              : "https://cyberworldbuilders.com/blog",
            dateModified: allPosts.length > 0
              ? allPosts.reduce((latest, p) => {
                  const d = new Date(p.modifiedDate);
                  return d > latest ? d : latest;
                }, new Date(allPosts[0].modifiedDate)).toISOString()
              : new Date().toISOString(),
            publisher: {
              "@type": "Organization",
              name: "CyberWorld Builders",
              logo: { "@type": "ImageObject", url: "https://cyberworldbuilders.com/images/logo.png" },
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: allPosts.length,
              itemListElement: posts.map((p, i) => ({
                "@type": "ListItem",
                position: startIndex + i + 1,
                url: `https://cyberworldbuilders.com/blog/${p.slug}`,
                name: p.title,
              })),
            },
          }),
        }}
      />

      <BlogPostList
        posts={posts.map((p) => ({ slug: p.slug, title: p.title, mtime: p.mtime.toISOString(), modifiedDate: p.modifiedDate, headerImage: p.headerImage, description: p.description, category: p.category, wordCount: p.wordCount, keywords: p.keywords, tags: p.tags }))}
        allPosts={allPosts.map((p) => ({ slug: p.slug, title: p.title, mtime: p.mtime.toISOString(), modifiedDate: p.modifiedDate, headerImage: p.headerImage, description: p.description, category: p.category, wordCount: p.wordCount, keywords: p.keywords, tags: p.tags }))}
        totalPages={totalPages}
        currentPage={currentPage}
        paginationBase={paginationBase}
      />

      {/* Topic Clusters */}
      <div className="w-full max-w-4xl">
        <TopicClusters allPosts={allPosts} />
      </div>

      {/* Browse by Tags — bottom of page, least prominent discovery path */}
      {!tagFilter && (
        <div className="w-full max-w-2xl mt-8 mb-4">
          <div className="flex justify-center">
            <Link
              href="/blog/tags"
              className="px-4 py-2 text-sm text-[#00ff00]/50 hover:text-[#00ff00] border border-[#00ff00]/15 hover:border-[#00ff00]/30 rounded-lg transition-colors"
            >
              Browse by Tags
            </Link>
          </div>
        </div>
      )}
      </div>
    </div>
  );
  
  } catch (error) {
    console.error('Error in BlogIndex:', error);
    return (
      <div className="min-h-screen flex flex-col items-center py-8">
        <h1 className="text-2xl font-bold mb-4">Blog</h1>
        <p>Error loading blog posts. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
