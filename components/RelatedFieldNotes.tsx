import Link from 'next/link';
import Image from 'next/image';
import type { RelatedPostScore } from '@/lib/related-posts';

interface RelatedFieldNotesProps {
  posts: RelatedPostScore[];
}

function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RelatedFieldNotes({ posts }: RelatedFieldNotesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-[#00ff00]/20">
      <h3 className="text-2xl font-bold mb-6 text-[#00ff00]">Related field notes</h3>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="not-prose flex flex-col gap-4 p-4 border border-[#00ff00]/30 rounded-lg hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-colors no-underline group"
          >
            {post.headerImage && (
              <div className="relative w-full aspect-[16/9] rounded overflow-hidden bg-black">
                <Image
                  src={post.headerImage}
                  alt={`Hero image for ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#00ff00]/70 mb-1 uppercase tracking-wide flex items-center gap-2">
                {post.category && <span>{post.category}</span>}
                {post.category && <span className="text-[#657065]">/</span>}
                <span>{dateLabel(post.publishedDate)}</span>
              </div>
              <div className="font-bold text-white group-hover:text-[#00ff00] line-clamp-2 transition-colors">
                {post.title}
              </div>
              <div className="text-sm text-gray-400 line-clamp-2 mt-1">
                {post.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
