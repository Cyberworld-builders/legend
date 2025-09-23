import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPostsWithMetadata } from '@/lib/post-metadata';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `Posts tagged with "${decodedTag}" - CyberWorld Builders Blog`,
    description: `Browse all blog posts tagged with "${decodedTag}" - Software engineering insights and technical articles from CyberWorld Builders.`,
    openGraph: {
      title: `Posts tagged with "${decodedTag}" - CyberWorld Builders Blog`,
      description: `Browse all blog posts tagged with "${decodedTag}" - Software engineering insights and technical articles from CyberWorld Builders.`,
      url: `https://cyberworldbuilders.com/blog/tag/${tag}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Posts tagged with "${decodedTag}" - CyberWorld Builders Blog`,
      description: `Browse all blog posts tagged with "${decodedTag}" - Software engineering insights and technical articles from CyberWorld Builders.`,
    },
    alternates: {
      canonical: `https://cyberworldbuilders.com/blog/tag/${tag}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const allPosts = await getAllPostsWithMetadata();
    const allTags = new Set<string>();
    
    allPosts.forEach(post => {
      if (post.metadata.tags) {
        post.metadata.tags.forEach(tag => allTags.add(tag));
      }
      if (post.metadata.keywords) {
        post.metadata.keywords.forEach(keyword => allTags.add(keyword));
      }
    });
    
    return Array.from(allTags).map(tag => ({
      tag: encodeURIComponent(tag),
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  try {
    // Get all posts with metadata
    const allPosts = await getAllPostsWithMetadata();
    
    // Filter posts that have this tag
    const taggedPosts = allPosts.filter(post => {
      const hasTag = post.metadata.tags?.includes(decodedTag);
      const hasKeyword = post.metadata.keywords?.includes(decodedTag);
      return hasTag || hasKeyword;
    });
    
    if (taggedPosts.length === 0) {
      notFound();
    }
    
    // Sort by publication date (most recent first)
    taggedPosts.sort((a, b) => {
      const dateA = a.metadata.publishedDate || a.fileStats.ctime;
      const dateB = b.metadata.publishedDate || b.fileStats.ctime;
      return dateB.getTime() - dateA.getTime();
    });
    
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
              loading="lazy"
            />
          </Link>
        </div>
        
        {/* Breadcrumb Navigation */}
        <div className="w-full max-w-4xl mb-6">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: `Tag: ${decodedTag}` }
            ]} 
          />
        </div>
        
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[#00ff00]">
              Posts tagged with &ldquo;{decodedTag}&rdquo;
            </h1>
            <p className="text-[#00ff00]/70 text-lg">
              {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
          
          {/* Posts List */}
          <div className="space-y-6">
            {taggedPosts.map((post) => {
              const title = post.metadata.title || post.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const description = post.metadata.description || `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;
              const publishedDate = post.metadata.publishedDate || post.fileStats.ctime;
              
              return (
                <article key={post.slug} className="border border-[#00ff00]/20 rounded-lg p-6 hover:border-[#00ff00]/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Post Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
                        >
                          {title}
                        </Link>
                      </h2>
                      
                      {description && (
                        <p className="text-[#00ff00]/80 mb-4 leading-relaxed">
                          {description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#00ff00]/70">
                        <time dateTime={publishedDate.toISOString()}>
                          {publishedDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                        
                        {post.metadata.readingTime && (
                          <span>{post.metadata.readingTime} min read</span>
                        )}
                        
                        {post.metadata.wordCount && (
                          <span>{post.metadata.wordCount} words</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Tags */}
                  {((post.metadata.tags && post.metadata.tags.length > 0) || (post.metadata.keywords && post.metadata.keywords.length > 0)) && (
                    <div className="mt-4 pt-4 border-t border-[#00ff00]/10">
                      <div className="flex flex-wrap gap-2">
                        {(post.metadata.tags || post.metadata.keywords || []).map((postTag: string) => (
                          <Link
                            key={postTag}
                            href={`/blog/tag/${encodeURIComponent(postTag)}`}
                            className={`px-2 py-1 rounded-full text-xs transition-colors ${
                              postTag === decodedTag
                                ? 'bg-[#00ff00]/20 border border-[#00ff00] text-[#00ff00]'
                                : 'bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00]/80 hover:bg-[#00ff00]/20 hover:text-[#00ff00]'
                            }`}
                          >
                            #{postTag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          
          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error loading tag page for ${decodedTag}:`, error);
    notFound();
  }
}
