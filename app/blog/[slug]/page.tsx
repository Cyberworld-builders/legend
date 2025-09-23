import { notFound } from 'next/navigation';
import Article from '@/components/Article';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedPosts from '@/components/RelatedPosts';
import SocialShare from '@/components/SocialShare';
import Link from 'next/link';
import Image from 'next/image';
import { getPostWithMetadata, getAllPostsWithMetadata } from '@/lib/post-metadata';
import type { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await getPostWithMetadata(slug);
    
    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }
    
    const { metadata } = post;
    const title = metadata.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const description = metadata.description || `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;
    const url = metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}`;
    const socialImage = metadata.socialImage || 'https://cyberworldbuilders.com/images/logo.png';
    const publishedTime = metadata.publishedDate?.toISOString() || new Date().toISOString();
    const modifiedTime = metadata.modifiedDate?.toISOString() || new Date().toISOString();
    
    return {
      title,
      description,
      keywords: metadata.keywords,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [metadata.author?.name || 'Jay Long'],
        siteName: 'CyberWorld Builders',
        images: [
          {
            url: socialImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [socialImage],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);
    return {
      title: 'Blog Post',
      description: 'Software engineering insights and technical articles from CyberWorld Builders.',
    };
  }
}

export async function generateStaticParams() {
  const allPostsWithMetadata = await getAllPostsWithMetadata();
  return allPostsWithMetadata.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  
  // Get the current post with metadata
  const post = await getPostWithMetadata(slug);
  
  if (!post) {
    notFound();
  }

  // Get all posts for navigation and related posts
  const allPostsWithMetadata = await getAllPostsWithMetadata();
  const allPosts = allPostsWithMetadata.map(p => ({
    slug: p.slug,
    title: p.metadata.title || p.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    mtime: p.metadata.publishedDate || p.fileStats.ctime,
  }));
  
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const { content: markdownContent, metadata } = post;
  const title = metadata.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const description = metadata.description || `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;

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
        <div className="w-full max-w-3xl mb-6">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
            ]} 
          />
        </div>

        {/* Header Image */}
        {metadata.headerImage && (
          <div className="w-full max-w-4xl mb-8">
            <Image
              src={metadata.headerImage}
              alt={title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              width={1200}
              height={630}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Article Meta Information */}
        <div className="w-full max-w-3xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00ff00]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#00ff00] text-sm font-bold">JL</span>
                </div>
                <div>
                  <p className="text-[#00ff00] font-medium">Jay Long</p>
                  <p className="text-[#00ff00]/70 text-sm">Software Engineer & Founder</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-1">
              <p className="text-[#00ff00]/70 text-sm">
                Published {metadata.publishedDate ? 
                  new Date(metadata.publishedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 
                  new Date(post.fileStats.ctime).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                }
              </p>
              {metadata.modifiedDate && metadata.modifiedDate !== metadata.publishedDate && (
                <p className="text-[#00ff00]/50 text-xs">
                  Updated {new Date(metadata.modifiedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              "description": description,
              "image": "https://cyberworldbuilders.com/images/logo.png",
              "author": {
                "@type": "Person",
                "name": "Jay Long",
                "url": "https://cyberworldbuilders.com",
                "sameAs": [
                  "https://github.com/CyberWorld-builders",
                  "https://youtube.com/@cyberbuilders",
                  "https://x.com/cyberbuilders",
                  "https://www.facebook.com/cyberworldbuilders",
                  "https://www.upwork.com/freelancers/jaylongcyberworld"
                ]
              },
              "publisher": {
                "@type": "Organization",
                "name": "CyberWorld Builders",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://cyberworldbuilders.com/images/logo.png",
                  "width": 250,
                  "height": 250
                }
              },
              "datePublished": metadata.publishedDate?.toISOString() || new Date().toISOString(),
              "dateModified": metadata.modifiedDate?.toISOString() || new Date().toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}`
              },
              "url": metadata.canonicalUrl || `https://cyberworldbuilders.com/blog/${slug}`,
              "articleSection": metadata.category || "Technology",
              "keywords": metadata.keywords || ["software engineering", "web development", "AWS", "SaaS development", "technology"],
              "wordCount": metadata.wordCount || markdownContent.split(' ').length,
              "inLanguage": metadata.language || "en-US"
            })
          }}
        />
        
        <Article content={markdownContent} currentSlug={slug} />
        
        {/* Tags */}
        {((metadata.tags && metadata.tags.length > 0) || (metadata.keywords && metadata.keywords.length > 0)) && (
          <div className="w-full max-w-3xl mt-8">
            <div className="border-t border-[#00ff00]/20 pt-6">
              <h3 className="text-lg font-semibold text-[#00ff00] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(metadata.tags || metadata.keywords || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded-full text-sm text-[#00ff00]/80 hover:bg-[#00ff00]/20 hover:text-[#00ff00] transition-colors cursor-pointer"
                    title={`Filter by ${tag}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Social Sharing */}
        <div className="w-full max-w-3xl">
          <SocialShare 
            url={`https://cyberworldbuilders.com/blog/${slug}`}
            title={title}
            description={description}
          />
        </div>
        
        {/* Related Posts */}
        <div className="w-full max-w-3xl">
          <RelatedPosts currentSlug={slug} allPosts={allPosts} />
        </div>
        
        {/* Post Navigation */}
        <div className="mt-8 flex justify-between w-full max-w-2xl">
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              ← {prevPost.title}
            </Link>
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="text-[#00ff00] hover:text-[#00cc00] hover:underline"
            >
              {nextPost.title} →
            </Link>
          )}
        </div>
      </div>
    );
}