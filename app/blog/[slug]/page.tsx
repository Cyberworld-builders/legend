import { notFound } from 'next/navigation';
import Article from '../../../components/Article';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const fs = await import('fs');
  const path = await import('path');
  const postsDirectory = path.join(process.cwd(), 'app/blog');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter((filename) => filename.endsWith('.tsx') && filename !== 'template.tsx')
    .map((filename) => ({
      slug: filename.replace(/\.tsx$/, ''),
    }));
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = params;

  try {
    const postModule = await import(`../${slug}`);
    const PostComponent = postModule.default;
    
    if (!PostComponent || typeof PostComponent !== 'function') {
      console.error(`Invalid blog post component for slug: ${slug}`);
      notFound();
    }

    const postContent = PostComponent();
    if (!postContent || !postContent.props || !postContent.props.children) {
      console.error(`Invalid blog post content structure for slug: ${slug}`);
      notFound();
    }

    const markdownContent = postContent.props.children.props?.content;
    if (!markdownContent) {
      console.error(`No markdown content found for slug: ${slug}`);
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col items-center py-8">
        <h1 className="text-3xl font-bold uppercase mb-8">Blog</h1>
        <Article content={markdownContent} />
      </div>
    );
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    notFound();
  }
}