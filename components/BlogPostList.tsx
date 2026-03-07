'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchInput from './SearchInput';

interface BlogPost {
  slug: string;
  title: string;
  mtime: string; // ISO string for serialization
}

interface BlogPostListProps {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  paginationBase: string;
}

export default function BlogPostList({ posts, totalPages, currentPage, paginationBase }: BlogPostListProps) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts;

  return (
    <>
      <div className="w-full max-w-2xl mb-6 flex justify-center">
        <SearchInput placeholder="Search posts by title..." onSearch={setQuery} />
      </div>

      <div className="w-full max-w-2xl">
        {filtered.length === 0 ? (
          <p className="text-[#00ff00]/70 text-center">No posts match your search.</p>
        ) : (
          filtered.map((post) => (
            <div key={post.slug} className="mb-6">
              <Link
                href={`/blog/${post.slug}`}
                className="text-2xl text-[#00ff00] hover:text-[#00cc00] hover:underline"
              >
                {post.title}
              </Link>
            </div>
          ))
        )}
      </div>

      {!query && totalPages > 1 && (
        <div className="flex gap-4 mt-8">
          {currentPage > 1 && (
            <Link
              href={`${paginationBase}${paginationBase.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              &larr; Previous
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`${paginationBase}${paginationBase.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              Next &rarr;
            </Link>
          )}
        </div>
      )}
    </>
  );
}
