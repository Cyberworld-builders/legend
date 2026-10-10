import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { PostMeta } from './post-types';

/**
 * Blog posts live as MDX files in content/blog/<slug>.mdx: YAML frontmatter
 * (validated below against PostMeta) followed by a markdown body. Everything
 * here runs at build time — there is no generated index to keep in sync.
 */
export const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostSource {
  meta: PostMeta;
  body: string;
  wordCount: number;
}

const STRING_FIELDS = ['title', 'description', 'slug', 'publishedDate', 'modifiedDate', 'canonicalUrl', 'socialImage', 'socialImageAlt', 'headerImage', 'series', 'category', 'language'] as const;
const LIST_FIELDS = ['keywords', 'topics', 'tags'] as const;
const BOOLEAN_FIELDS = ['isDraft', 'isFeatured'] as const;
const REQUIRED_FIELDS = ['title', 'description', 'slug', 'publishedDate'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// YAML parses an unquoted 2026-03-08 as a Date; normalize back to the string form.
function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function validate(file: string, data: Record<string, unknown>): PostMeta {
  const errors: string[] = [];
  const meta: Record<string, unknown> = {};

  for (const key of Object.keys(data)) {
    const value = normalizeValue(data[key]);
    if ((STRING_FIELDS as readonly string[]).includes(key)) {
      if (typeof value !== 'string') errors.push(`${key} must be a string`);
    } else if ((LIST_FIELDS as readonly string[]).includes(key)) {
      if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) errors.push(`${key} must be a list of strings`);
    } else if ((BOOLEAN_FIELDS as readonly string[]).includes(key)) {
      if (typeof value !== 'boolean') errors.push(`${key} must be true or false`);
    } else if (key === 'priority') {
      if (typeof value !== 'number') errors.push('priority must be a number');
    } else {
      errors.push(`unknown field ${key}`);
    }
    meta[key] = value;
  }

  for (const key of REQUIRED_FIELDS) {
    if (!meta[key]) errors.push(`${key} is required`);
  }
  const expectedSlug = path.basename(file, '.mdx');
  if (meta.slug && meta.slug !== expectedSlug) errors.push(`slug "${meta.slug}" must match the filename "${expectedSlug}"`);
  for (const key of ['publishedDate', 'modifiedDate']) {
    if (meta[key] && !DATE_RE.test(meta[key] as string)) errors.push(`${key} must be YYYY-MM-DD`);
  }

  if (errors.length) {
    throw new Error(`Invalid frontmatter in content/blog/${file}:\n  - ${errors.join('\n  - ')}`);
  }
  if (!meta.modifiedDate) meta.modifiedDate = meta.publishedDate;
  return meta as unknown as PostMeta;
}

function countWords(markdown: string): number {
  const text = markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`[\]\\-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

let cache: PostSource[] | null = null;

/** Every post on disk, drafts included, newest first (ties broken by priority). */
export function loadPosts(): PostSource[] {
  if (cache) return cache;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx')).sort();
  const posts = files.map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
    return { meta: validate(file, data), body: content, wordCount: countWords(content) };
  });

  posts.sort((a, b) => {
    const byDate = new Date(b.meta.publishedDate).getTime() - new Date(a.meta.publishedDate).getTime();
    if (byDate !== 0) return byDate;
    return (b.meta.priority || 0) - (a.meta.priority || 0);
  });

  cache = posts;
  return posts;
}
