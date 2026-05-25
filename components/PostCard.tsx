import Link from 'next/link';
import Image from 'next/image';
import postIndex from '@/lib/post-index.json';

interface IndexedPost {
  slug: string;
  title: string;
  description: string;
  headerImage?: string;
  publishedDate?: string;
}

interface PostCardProps {
  slug: string;
}

export default function PostCard({ slug }: PostCardProps) {
  const posts = (postIndex as { posts: IndexedPost[] }).posts;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="my-6 p-4 border border-red-500 rounded text-red-500 text-sm">
        Missing post in index: <code>{slug}</code>
      </div>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="not-prose flex gap-4 my-6 p-4 border border-[#00ff00]/30 rounded-lg hover:border-[#00ff00] hover:bg-[#00ff00]/5 transition-colors no-underline group"
    >
      {post.headerImage && (
        <div className="relative flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 rounded overflow-hidden bg-black">
          <Image
            src={post.headerImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 128px, 160px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[#00ff00]/70 mb-1 uppercase tracking-wide">
          cyberworldbuilders.com / blog
        </div>
        <div className="font-bold text-white group-hover:text-[#00ff00] line-clamp-2 transition-colors">
          {post.title}
        </div>
        <div className="text-sm text-gray-400 line-clamp-2 mt-1">
          {post.description}
        </div>
      </div>
    </Link>
  );
}
