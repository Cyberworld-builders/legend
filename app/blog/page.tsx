
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import TopicClusters from '@/components/TopicClusters';
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Software Engineering Insights & Technical Articles',
    description: 'Read the latest insights on software engineering, web development, AWS solutions, and SaaS development from CyberWorld Builders.',
  },
  alternates: {
    canonical: 'https://cyberworldbuilders.com/blog',
  },
};

interface BlogIndexProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts/markdown');
  const filenames = await fs.readdir(postsDirectory);

  const allPosts = await Promise.all(
    filenames
      .filter((filename) => 
        filename.endsWith('.md') &&
        !filename.startsWith('.')
      )
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const stats = await fs.stat(filePath);
        return {
          slug: filename.replace(/\.md$/, ''),
          title: filename
            .replace(/\.md$/, '')
            .replace(/-/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          mtime: stats.mtime,
        };
      })
  );

  // Sort by modification date (most recent first)
  allPosts.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="flex justify-center mb-4">
        <Link href="/">
          <Image
            src="/icons/favicon.ico"
            alt="CyberWorld Builders - Software Engineering & Consulting Services"
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
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
  );
}
