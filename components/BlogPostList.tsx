'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchInput from './SearchInput';

interface BlogPost {
  slug: string;
  title: string;
  mtime: string;
}

interface BlogPostListProps {
  posts: BlogPost[];
  allPosts: BlogPost[];
  totalPages: number;
  currentPage: number;
  paginationBase: string;
}

export default function BlogPostList({ posts, allPosts, totalPages, currentPage, paginationBase }: BlogPostListProps) {
  const [query, setQuery] = useState('');

  const isSearching = query.length > 0;
  const displayPosts = isSearching
    ? allPosts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : posts;

  return (
    <>
      <div className="w-full max-w-2xl mb-6 flex justify-center">
        <SearchInput placeholder="Search posts by title..." onSearch={setQuery} />
      </div>

      <div className="w-full max-w-2xl">
        {displayPosts.length === 0 ? (
          <p className="text-[#00ff00]/70 text-center">No posts match your search.</p>
        ) : (
          displayPosts.map((post) => (
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

      {isSearching && displayPosts.length > 0 && (
        <p className="text-[#00ff00]/50 text-sm mt-2">
          {displayPosts.length} result{displayPosts.length === 1 ? '' : 's'} found
        </p>
      )}

      {!isSearching && totalPages > 1 && (
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
