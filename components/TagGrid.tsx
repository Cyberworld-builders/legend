'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchInput from './SearchInput';

interface TagGridProps {
  categorizedTags: Record<string, Array<[string, number]>>;
  totalTags: number;
  totalPosts: number;
}

export default function TagGrid({ categorizedTags, totalTags, totalPosts }: TagGridProps) {
  const [query, setQuery] = useState('');

  // When searching, flatten all tags and filter
  const isSearching = query.length > 0;

  const allTagsFlat = Object.values(categorizedTags).flat();
  const filteredTags = isSearching
    ? allTagsFlat.filter(([tag]) => tag.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <>
      <div className="flex justify-center mb-8">
        <SearchInput placeholder="Search tags..." onSearch={setQuery} />
      </div>

      {isSearching ? (
        <div className="border border-[#00ff00]/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#00ff00]">
            Results ({filteredTags.length})
          </h2>
          {filteredTags.length === 0 ? (
            <p className="text-[#00ff00]/70">No tags match your search.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {filteredTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="group px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full text-[#00ff00]/80 hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
                >
                  <span className="font-medium">#{tag}</span>
                  <span className="ml-2 text-xs text-[#00ff00]/60 group-hover:text-[#00ff00]/80">
                    ({count})
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categorizedTags).map(([category, tags]) => {
            if (tags.length === 0) return null;
            return (
              <section key={category} className="border border-[#00ff00]/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-[#00ff00]">{category}</h2>
                <div className="flex flex-wrap gap-3">
                  {tags.map(([tag, count]) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="group px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full text-[#00ff00]/80 hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
                    >
                      <span className="font-medium">#{tag}</span>
                      <span className="ml-2 text-xs text-[#00ff00]/60 group-hover:text-[#00ff00]/80">
                        ({count})
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-8 px-6 py-4 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00ff00]">{totalTags}</div>
            <div className="text-sm text-[#00ff00]/70">Total Tags</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00ff00]">{totalPosts}</div>
            <div className="text-sm text-[#00ff00]/70">Total Posts</div>
          </div>
        </div>
      </div>
    </>
  );
}
