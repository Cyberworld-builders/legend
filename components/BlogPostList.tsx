'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './SearchInput';

interface BlogPost {
  slug: string;
  title: string;
  mtime: string;
  headerImage?: string;
  description?: string;
  category?: string;
  wordCount?: number;
  keywords?: string[];
  tags?: string[];
}

interface BlogPostListProps {
  posts: BlogPost[];
  allPosts: BlogPost[];
  totalPages: number;
  currentPage: number;
  paginationBase: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readingTime(wordCount: number): string {
  const mins = Math.max(1, Math.round(wordCount / 250));
  return `${mins} min read`;
}

export default function BlogPostList({ posts, allPosts, totalPages, currentPage, paginationBase }: BlogPostListProps) {
  const [query, setQuery] = useState('');

  const isSearching = query.length > 0;
  const displayPosts = isSearching
    ? allPosts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q)) ||
          (p.keywords?.some(k => k.toLowerCase().includes(q))) ||
          (p.tags?.some(t => t.toLowerCase().includes(q))) ||
          (p.category?.toLowerCase().includes(q))
        );
      })
    : posts;

  return (
    <>
      <div className="w-full max-w-2xl px-4 mb-6 flex justify-center">
        <SearchInput placeholder="Search posts..." onSearch={setQuery} />
      </div>

      <div className="w-full max-w-2xl px-4">
        {displayPosts.length === 0 ? (
          <p className="text-[#00ff00]/70 text-center">No posts match your search.</p>
        ) : (
          displayPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block mb-4 p-3 rounded-lg hover:bg-[#00ff00]/5 transition-colors"
            >
              {/* Row 1: Thumbnail + Title side by side */}
              <div className="flex items-center gap-3">
                {post.headerImage && (
                  <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border border-[#00ff00]/20 group-hover:border-[#00ff00]/40 transition-colors">
                    <Image
                      src={post.headerImage}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      sizes="48px"
                    />
                  </div>
                )}
                <span className="text-lg text-[#00ff00] group-hover:text-[#00cc00] transition-colors leading-snug">
                  {post.title}
                </span>
              </div>

              {/* Row 2: Description — full width */}
              {post.description && (
                <p className="text-sm text-[#00ff00]/50 leading-relaxed mt-2 line-clamp-2">
                  {post.description}
                </p>
              )}

              {/* Row 3: Meta line — full width */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-xs text-[#00ff00]/40">
                {post.mtime && formatDate(post.mtime) && (
                  <span>{formatDate(post.mtime)}</span>
                )}
                {post.category && (
                  <>
                    <span className="text-[#00ff00]/20">&middot;</span>
                    <span>{post.category}</span>
                  </>
                )}
                {post.wordCount && post.wordCount > 0 && (
                  <>
                    <span className="text-[#00ff00]/20">&middot;</span>
                    <span>{readingTime(post.wordCount)}</span>
                  </>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {isSearching && displayPosts.length > 0 && (
        <p className="text-[#00ff00]/50 text-sm mt-2 px-4">
          {displayPosts.length} result{displayPosts.length === 1 ? '' : 's'} found
        </p>
      )}

      {!isSearching && totalPages > 1 && (
        <div className="flex gap-4 mt-8 px-4">
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
