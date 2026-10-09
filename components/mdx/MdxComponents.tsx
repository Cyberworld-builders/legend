import type { ComponentPropsWithoutRef } from 'react';
import PostCard from '@/components/PostCard';

/**
 * Element styling for every blog post body. Posts in content/blog/*.mdx carry
 * no classes; change the look of all posts here.
 */

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full max-w-md mx-auto rounded" />
      {caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{caption}</figcaption>}
    </figure>
  );
}

function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className="text-[#00ff00] underline"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
}

export const mdxComponents = {
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="mb-4 leading-relaxed" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="text-2xl font-bold mb-4 mt-8 text-[#00ff00]" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="text-xl font-bold mb-3 mt-6 text-[#00ff00]" {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="mb-1" {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold text-[#00ff00]" {...props} />,
  code: (props: ComponentPropsWithoutRef<'code'>) => <code className="bg-gray-800 px-1 rounded text-sm" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-[#00ff00] pl-4 italic mb-4" {...props} />
  ),
  a: Anchor,
  Figure,
  PostCard,
};
