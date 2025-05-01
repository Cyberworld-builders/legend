import { notFound } from 'next/navigation';
import Article from '@/components/Article';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const fs = await import('fs');
  const path = await import('path');
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter((filename) => filename.endsWith('.tsx') && filename !== 'template.tsx')
    .map((filename) => ({
      slug: filename.replace(/\.tsx$/, ''),
    }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;

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
      </div>
    );
  } catch (error) {
    console.error(`Error loading blog post for slug: ${slug}`, error);
    notFound();
  }
}