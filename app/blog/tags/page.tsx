import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import PageBackground from '@/components/PageBackground';
import TagGrid from '@/components/TagGrid';
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
    const allPosts = await getAllPostsWithMetadata();

    // Collect all tags with their post counts
    const tagCounts = new Map<string, number>();

    allPosts.forEach(post => {
      if (post.metadata.tags) {
        post.metadata.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
      if (post.metadata.keywords) {
        post.metadata.keywords.forEach(keyword => {
          tagCounts.set(keyword, (tagCounts.get(keyword) || 0) + 1);
        });
      }
    });

    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    // Group tags by category
    const tagCategories: Record<string, string[]> = {
      'Technology': ['AI', 'automation', 'technology', 'innovation', 'digital-tools', 'blog-bot', 'AI-agents', 'content-creation', 'digital-legacy'],
      'Career & Development': ['career-development', 'professional-validation', 'personal-branding', 'content-strategy', 'career', 'first-job', 'career-transition'],
      'Business & Marketing': ['marketing', 'business', 'startup', 'partnerships', 'founder', 'engineer', 'industry-trends'],
      'Development & Tools': ['web-development', 'programming', 'software-development', 'tools', 'testing', 'IDE', 'development'],
      'Content & Writing': ['blogging', 'content-creation', 'writing', 'digital-presence', 'SEO', 'content-strategy'],
      'Entertainment & Media': ['mixed-reality', 'virtual-reality', 'augmented-reality', 'IoT', 'location-based', 'entertainment-tech', 'horror', 'seasonal-business', 'mobile-apps', 'theatrical', 'startup'],
      'Healthcare & Industry': ['healthcare', 'EMR', 'electronic-medical-records', 'technology'],
      'Learning & Education': ['coding-journey', 'self-directed-learning', 'programming', 'HTML', 'CSS', 'Flash', 'biographical', 'early-career'],
      'Productivity & Frameworks': ['productivity', 'framework', 'value', 'passion', 'alignment', 'career-development'],
      'Other': [],
    };

    const categorizedTags: Record<string, Array<[string, number]>> = {};
    const uncategorizedTags: Array<[string, number]> = [];

    Object.keys(tagCategories).forEach(category => {
      categorizedTags[category] = [];
    });

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

    categorizedTags['Other'] = uncategorizedTags;

    return (
      <div className="min-h-screen flex flex-col items-center py-8 relative">
        <PageBackground opacity={20} fullWidth={true} />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-full max-w-4xl mb-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: 'Tags' },
              ]}
            />
          </div>

          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-[#00ff00]">All Tags</h1>
              <p className="text-[#00ff00]/70 text-lg">
                Browse posts by topic, technology, or interest area
              </p>
            </div>

            <TagGrid
              categorizedTags={categorizedTags}
              totalTags={sortedTags.length}
              totalPosts={allPosts.length}
            />

            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-lg text-[#00ff00] hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors"
              >
                &larr; Back to All Posts
              </Link>
            </div>
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
            &larr; Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}
