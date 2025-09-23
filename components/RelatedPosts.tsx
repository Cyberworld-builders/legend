import Link from 'next/link';
import { getPostWithMetadata } from '@/lib/post-metadata';

interface Post {
  slug: string;
  title: string;
  mtime: Date;
  metadata?: {
    topics?: string[];
    tags?: string[];
    category?: string;
  };
}

interface RelatedPostsProps {
  currentSlug: string;
  allPosts: Post[];
}

// Topic categorization based on frontmatter metadata
const getPostTopics = (post: Post): string[] => {
  if (post.metadata?.topics) {
    return post.metadata.topics;
  }
  
  // Fallback to legacy topic mapping for posts without frontmatter
  const legacyTopicMap: { [key: string]: string[] } = {
    'building-an-effective-web-presence-for-professional-validation': ['Marketing & Business', 'Career & Professional Development'],
    'scaling-novelty-with-an-agentic-blog-bot': ['AI & Automation', 'Development & Tools'],
    'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation': ['AI & Automation', 'Development & Tools'],
    'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom': ['AI & Automation', 'Marketing & Business'],
    'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013': ['Career & Professional Development', 'Development & Tools'],
    'the-jumpstarter-a-5-point-framework-to-align-value-and-passion': ['Career & Professional Development'],
    'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end': ['Career & Professional Development', 'Marketing & Business'],
    'replit-test-drive': ['Development & Tools']
  };
  
  return legacyTopicMap[post.slug] || ['General'];
};

const findRelatedPosts = (currentSlug: string, allPosts: Post[]): Post[] => {
  const currentPost = allPosts.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  const currentTopics = getPostTopics(currentPost);
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  
  // Score posts based on topic overlap
  const scoredPosts = otherPosts.map(post => {
    const postTopics = getPostTopics(post);
    const commonTopics = currentTopics.filter(topic => postTopics.includes(topic));
    const score = commonTopics.length;
    
    return { ...post, score };
  });
  
  // Sort by score (highest first) and then by date (newest first)
  return scoredPosts
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.mtime.getTime() - a.mtime.getTime();
    })
    .slice(0, 3) // Return top 3 related posts
    .map(post => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { score, ...postWithoutScore } = post;
      return postWithoutScore;
    }); // Remove score from final result
};

export default function RelatedPosts({ currentSlug, allPosts }: RelatedPostsProps) {
  const relatedPosts = findRelatedPosts(currentSlug, allPosts);
  
  if (relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12 pt-8 border-t border-[#00ff00]/20">
      <h3 className="text-2xl font-bold mb-6 text-[#00ff00]">Related Articles</h3>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 border border-[#00ff00]/20 rounded-lg hover:border-[#00ff00]/40 hover:bg-[#00ff00]/5 transition-all duration-200"
          >
            <h4 className="text-lg font-semibold mb-2 text-[#00ff00] hover:text-[#00cc00] transition-colors">
              {post.title}
            </h4>
            <p className="text-sm text-[#00ff00]/70">
              {new Date(post.mtime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
