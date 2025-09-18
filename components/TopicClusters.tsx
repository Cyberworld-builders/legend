import Link from 'next/link';
import { getTopicClusters } from '@/lib/content-utils';

interface Post {
  slug: string;
  title: string;
  mtime: Date;
}

interface TopicClustersProps {
  allPosts: Post[];
}

export default function TopicClusters({ allPosts }: TopicClustersProps) {
  const clusters = getTopicClusters();
  
  return (
    <div className="mt-12 pt-8 border-t border-[#00ff00]/20">
      <h3 className="text-2xl font-bold mb-6 text-[#00ff00]">Explore by Topic</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(clusters).map(([topic, postSlugs]) => {
          const topicPosts = allPosts.filter(post => postSlugs.includes(post.slug));
          
          if (topicPosts.length === 0) return null;
          
          return (
            <div key={topic} className="border border-[#00ff00]/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3 text-[#00ff00]">{topic}</h4>
              <ul className="space-y-2">
                {topicPosts.slice(0, 3).map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-[#00ff00]/80 hover:text-[#00cc00] hover:underline transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
                {topicPosts.length > 3 && (
                  <li className="text-xs text-[#00ff00]/60">
                    +{topicPosts.length - 3} more articles
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
