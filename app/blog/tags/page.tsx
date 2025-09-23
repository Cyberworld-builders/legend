import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllPostsWithMetadata } from '@/lib/post-metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Tags - CyberWorld Builders Blog',
  description: 'Browse all tags and categories from the CyberWorld Builders blog. Find posts by topic, technology, or interest area.',
  openGraph: {
    title: 'All Tags - CyberWorld Builders Blog',
    description: 'Browse all tags and categories from the CyberWorld Builders blog. Find posts by topic, technology, or interest area.',
    url: 'https://cyberworldbuilders.com/blog/tags',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tags - CyberWorld Builders Blog',
    description: 'Browse all tags and categories from the CyberWorld Builders blog. Find posts by topic, technology, or interest area.',
  },
  alternates: {
    canonical: 'https://cyberworldbuilders.com/blog/tags',
  },
};

export default async function TagsPage() {
  try {
    // Get all posts with metadata
    const allPosts = await getAllPostsWithMetadata();
    
    // Collect all tags with their post counts
    const tagCounts = new Map<string, number>();
    
    allPosts.forEach(post => {
      // Count tags
      if (post.metadata.tags) {
        post.metadata.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
      
      // Count keywords as tags too
      if (post.metadata.keywords) {
        post.metadata.keywords.forEach(keyword => {
          tagCounts.set(keyword, (tagCounts.get(keyword) || 0) + 1);
        });
      }
    });
    
    // Convert to array and sort by count (most used first)
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]);
    
    // Group tags by category for better organization
    const tagCategories: { [category: string]: string[] } = {
      'Technology': ['AI', 'automation', 'technology', 'innovation', 'digital-tools', 'blog-bot', 'AI-agents', 'content-creation', 'digital-legacy'],
      'Career & Development': ['career-development', 'professional-validation', 'personal-branding', 'content-strategy', 'career', 'first-job', 'career-transition'],
      'Business & Marketing': ['marketing', 'business', 'startup', 'partnerships', 'founder', 'engineer', 'industry-trends'],
      'Development & Tools': ['web-development', 'programming', 'software-development', 'tools', 'testing', 'IDE', 'development'],
      'Content & Writing': ['blogging', 'content-creation', 'writing', 'digital-presence', 'SEO', 'content-strategy'],
      'Entertainment & Media': ['mixed-reality', 'virtual-reality', 'augmented-reality', 'IoT', 'location-based', 'entertainment-tech', 'horror', 'seasonal-business', 'mobile-apps', 'theatrical', 'startup'],
      'Healthcare & Industry': ['healthcare', 'EMR', 'electronic-medical-records', 'technology'],
      'Learning & Education': ['coding-journey', 'self-directed-learning', 'programming', 'HTML', 'CSS', 'Flash', 'biographical', 'early-career'],
      'Productivity & Frameworks': ['productivity', 'framework', 'value', 'passion', 'alignment', 'career-development'],
      'Other': []
    };
    
    // Categorize tags
    const categorizedTags: { [category: string]: Array<[string, number]> } = {};
    const uncategorizedTags: Array<[string, number]> = [];
    
    // Initialize categories
    Object.keys(tagCategories).forEach(category => {
      categorizedTags[category] = [];
    });
    
    // Categorize tags
    sortedTags.forEach(([tag, count]) => {
      let categorized = false;
      
      for (const [category, categoryTags] of Object.entries(tagCategories)) {
        if (categoryTags.includes(tag)) {
          categorizedTags[category].push([tag, count]);
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        uncategorizedTags.push([tag, count]);
      }
    });
    
    // Add uncategorized tags to "Other"
    categorizedTags['Other'] = uncategorizedTags;
    
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
              { label: 'Tags' }
            ]} 
          />
        </div>
        
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[#00ff00]">
              All Tags
            </h1>
            <p className="text-[#00ff00]/70 text-lg">
              Browse posts by topic, technology, or interest area
            </p>
          </div>
          
          {/* Tags by Category */}
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
          
          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 px-6 py-4 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ff00]">{sortedTags.length}</div>
                <div className="text-sm text-[#00ff00]/70">Total Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00ff00]">{allPosts.length}</div>
                <div className="text-sm text-[#00ff00]/70">Total Posts</div>
              </div>
            </div>
          </div>
          
          {/* Back to Blog */}
          <div className="mt-8 text-center">
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
    console.error('Error loading tags page:', error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#00ff00]">Error Loading Tags</h1>
          <p className="text-[#00ff00]/70 mb-8">There was an error loading the tags page.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}
