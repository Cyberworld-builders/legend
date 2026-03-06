import type { ReactNode } from 'react';
import type { PostMeta } from '@/lib/post-types';

interface PostLayoutProps {
  meta: PostMeta;
  children: ReactNode;
}

/**
 * Wrapper for blog post content. The outer chrome (breadcrumbs, author info,
 * schema, tags, social share, related posts) lives in [slug]/page.tsx.
 * PostLayout handles content-level concerns only.
 */
export default function PostLayout({ children }: PostLayoutProps) {
  return <>{children}</>;
}
