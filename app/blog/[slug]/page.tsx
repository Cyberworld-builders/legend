import { notFound } from 'next/navigation';
import Article from '@/components/Article';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedPosts from '@/components/RelatedPosts';
import SocialShare from '@/components/SocialShare';
import Link from 'next/link';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const markdownPath = path.join(process.cwd(), `app/blog/posts/markdown/${slug}.md`);
    const markdownContent = await fs.readFile(markdownPath, 'utf8');
    
    // Extract title from first H1 or use slug
    const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Extract description from first paragraph or create one
    const descriptionMatch = markdownContent.match(/^##\s+Overview\s*\n\n([\s\S]+?)(?:\n\n|$)/) || 
                           markdownContent.match(/^([\s\S]+?)(?:\n\n|$)/);
    const description = descriptionMatch ? 
      descriptionMatch[1].replace(/\n/g, ' ').substring(0, 160) + '...' :
      `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;
    
    const url = `https://cyberworldbuilders.com/blog/${slug}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        publishedTime: new Date().toISOString(),
        authors: ['Jay Long'],
        siteName: 'CyberWorld Builders',
        images: [
          {
            url: 'https://cyberworldbuilders.com/images/logo.png',
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
        images: ['https://cyberworldbuilders.com/images/logo.png'],
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

async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts/markdown');
  const filenames = await fs.readdir(postsDirectory);

  const allPosts = await Promise.all(
    filenames
      .filter((filename) => 
        filename.endsWith('.md') &&
        !filename.startsWith('.')
      )
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const stats = await fs.stat(filePath);
        return {
          slug: filename.replace(/\.md$/, ''),
          title: filename
            .replace(/\.md$/, '')
            .replace(/-/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          mtime: stats.mtime,
        };
      })
  );

  // Sort by modification date (most recent first)
  return allPosts.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex(post => post.slug === slug);
  
  if (currentIndex === -1) {
    notFound();
  }

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  try {
    const markdownPath = path.join(process.cwd(), `app/blog/posts/markdown/${slug}.md`);
    const markdownContent = await fs.readFile(markdownPath, 'utf8');
    
    if (!markdownContent) {
      console.error(`No markdown content found for slug: ${slug}`);
      notFound();
    }

    // Extract title for breadcrumb
    const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Extract description for social sharing
    const descriptionMatch = markdownContent.match(/^##\s+Overview\s*\n\n([\s\S]+?)(?:\n\n|$)/) || 
                           markdownContent.match(/^([\s\S]+?)(?:\n\n|$)/);
    const description = descriptionMatch ? 
      descriptionMatch[1].replace(/\n/g, ' ').substring(0, 160) + '...' :
      `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;

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
              "datePublished": new Date().toISOString(),
              "dateModified": new Date().toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://cyberworldbuilders.com/blog/${slug}`
              },
              "url": `https://cyberworldbuilders.com/blog/${slug}`,
              "articleSection": "Technology",
              "keywords": ["software engineering", "web development", "AWS", "SaaS development", "technology"],
              "wordCount": markdownContent.split(' ').length,
              "inLanguage": "en-US"
            })
          }}
        />
        
        <Article content={markdownContent} currentSlug={slug} />
        
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
  } catch (error) {
    console.error(`Error loading blog post for slug: ${slug}`, error);
    notFound();
  }
}