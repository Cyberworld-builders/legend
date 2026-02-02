
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import SimpleSocialShare from '@/components/SimpleSocialShare';
import TopicClusters from '@/components/TopicClusters';
import PageBackground from '@/components/PageBackground';
import { getAllPostsWithMetadata } from '@/lib/post-metadata';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 5;

export const metadata: Metadata = {
  title: 'Blog - Software Engineering Insights & Technical Articles',
  description: 'Read the latest insights on software engineering, web development, AWS solutions, and SaaS development from CyberWorld Builders. Technical articles and industry perspectives.',
  openGraph: {
    title: 'Blog - Software Engineering Insights & Technical Articles',
    description: 'Read the latest insights on software engineering, web development, AWS solutions, and SaaS development from CyberWorld Builders.',
    url: 'https://cyberworldbuilders.com/blog',
    type: 'website',
    siteName: 'CyberWorld Builders',
    images: [
      {
        url: 'https://cyberworldbuilders.com/images/social-card.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders Blog - Software Engineering Insights',
      },
      {
        url: 'https://cyberworldbuilders.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'CyberWorld Builders Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cyberbuilders',
    creator: '@cyberbuilders',
    title: 'Blog - Software Engineering Insights & Technical Articles',
    description: 'Read the latest insights on software engineering, web development, AWS solutions, and SaaS development from CyberWorld Builders.',
    images: [
      'https://cyberworldbuilders.com/images/social-card.png',
      'https://cyberworldbuilders.com/images/logo.png'
    ],
  },
  alternates: {
    canonical: 'https://cyberworldbuilders.com/blog',
  },
};

// SSG + ISR: pre-render at build, revalidate every hour for crawler-friendly fresh HTML
export const revalidate = 3600;

interface BlogIndexProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  
  try {
    // Get all posts with metadata (already sorted by published date and priority)
    const allPostsWithMetadata = await getAllPostsWithMetadata();
    
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
    const allPosts = allPostsWithMetadata.map(post => ({
      slug: post.slug,
      title: post.metadata.title || post.slug
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      mtime: post.metadata.publishedDate || post.fileStats.ctime,
    }));

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative">
        {/* Page Background */}
        <PageBackground opacity={20} fullWidth={true} />
      
      {/* Content with higher z-index */}
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
      
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-2xl mb-6">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog' }
          ]} 
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      {/* Blog Navigation */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-center gap-4">
          <Link
            href="/blog/tags"
            className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
          >
            Browse by Tags
          </Link>
        </div>
      </div>
      
      {/* Blog Sharing */}
      <div className="w-full max-w-2xl mb-6">
        <SimpleSocialShare 
          url="https://cyberworldbuilders.com/blog"
          title="Software Engineering Insights & Technical Articles"
        />
      </div>
      
      <div className="w-full max-w-2xl">
        {posts.map((post) => (
          <div key={post.slug} className="mb-6">
            <Link
              href={`/blog/${post.slug}`}
              className="text-2xl text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </div>
      
      {/* Topic Clusters */}
      <div className="w-full max-w-4xl">
        <TopicClusters allPosts={allPosts} />
      </div>
      
      {totalPages > 1 && (
        <div className="flex gap-4 mt-8">
          {currentPage > 1 && (
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              ← Previous
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              Next →
            </Link>
          )}
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
