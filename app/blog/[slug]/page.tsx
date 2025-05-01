import { notFound } from 'next/navigation';
import Article from '@/components/Article';
import Link from 'next/link';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = await fs.readdir(postsDirectory);

  return filenames
    .filter((filename) => 
      filename.endsWith('.tsx') && 
      filename !== 'template.tsx' &&
      !filename.startsWith('[')
    )
    .map((filename) => ({
      slug: filename.replace(/\.tsx$/, ''),
      title: filename
        .replace(/\.tsx$/, '')
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))
    .sort((a, b) => b.title.localeCompare(a.title));
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

  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  try {
    const postModule = await import(`../posts/${slug}`);
    const PostComponent = postModule.default;
    
    if (!PostComponent || typeof PostComponent !== 'function') {
      console.error(`Invalid blog post component for slug: ${slug}`);
      notFound();
    }

    const postContent = await PostComponent();
    if (!postContent || !postContent.props) {
      console.error(`Invalid blog post content structure for slug: ${slug}`);
      notFound();
    }

    // Handle both direct content and nested content structures
    const markdownContent = postContent.props.content || 
                          (postContent.props.children?.props?.content);

    if (!markdownContent) {
      console.error(`No markdown content found for slug: ${slug}`);
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col items-center py-8">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src="/icons/favicon.ico"
              alt="CyberWorld Logo"
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="mb-4">
          <Link 
            href="/blog"
            className="text-[#00ff00] hover:text-[#00cc00] hover:underline text-lg uppercase"
          >
            ← Back to Blog
          </Link>
        </div>
        <Article content={markdownContent} />
        
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