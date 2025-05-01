import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';

const POSTS_PER_PAGE = 5;

interface BlogIndexProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BlogIndex({ searchParams }: BlogIndexProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = await fs.readdir(postsDirectory);

  const allPosts = filenames
    .filter((filename) => 
      filename.endsWith('.tsx') && 
      filename !== 'template.tsx' &&
      !filename.startsWith('[')
    )
    .map((filename) => ({
      slug: filename.replace(/\.tsx$/, ''),
      title: filename
        .replace(/\.tsx$/, '')
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))
    .sort((a, b) => b.title.localeCompare(a.title)); // Sort posts alphabetically

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <div className="flex justify-center mb-4">
        <Link href="/">
          <Image
            src="/icons/favicon.ico"
            alt="CyberWorld Logo"
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
        </Link>
      </div>
      <h1 className="text-3xl font-bold uppercase mb-8">Blog</h1>
      <div className="space-y-4 mb-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block text-[#00ff00] hover:text-[#00cc00] hover:underline text-lg uppercase"
          >
            {post.title}
          </Link>
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center space-x-4">
        {currentPage > 1 && (
          <Link
            href={`/blog?page=${currentPage - 1}`}
            className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
          >
            ← Previous
          </Link>
        )}
        
        <span className="text-[#00ff00]">
          Page {currentPage} of {totalPages}
        </span>
        
        {currentPage < totalPages && (
          <Link
            href={`/blog?page=${currentPage + 1}`}
            className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}