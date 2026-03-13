#!/usr/bin/env node

/**
 * Generate post-index.json by scanning TSX post files and reading their metadata exports.
 * This replaces the old triple-generation pipeline.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'app', 'blog', 'posts');
const INDEX_FILE = path.join(__dirname, '..', 'lib', 'post-index.json');

// Extract the metadata object from a TSX file using regex.
// This avoids needing a TS compiler — we just parse the literal.
function extractMetadata(content) {
  // Match: export const metadata: PostMeta = { ... };
  const match = content.match(/export const metadata:\s*PostMeta\s*=\s*(\{[\s\S]*?\n\};)/);
  if (!match) return null;

  // Convert the TS object literal to valid JSON-ish by evaluating it
  // We'll parse it more safely by extracting key-value pairs
  const block = match[1];
  const meta = {};

  // Simple string fields
  for (const key of ['title', 'description', 'slug', 'publishedDate', 'modifiedDate', 'canonicalUrl', 'socialImage', 'headerImage', 'series', 'category', 'language']) {
    const m = block.match(new RegExp(`${key}:\\s*"([^"]*?)"`));
    if (m) meta[key] = m[1];
  }

  // Boolean fields
  for (const key of ['isDraft', 'isFeatured']) {
    const m = block.match(new RegExp(`${key}:\\s*(true|false)`));
    if (m) meta[key] = m[1] === 'true';
  }

  // Number fields
  for (const key of ['priority']) {
    const m = block.match(new RegExp(`${key}:\\s*(\\d+)`));
    if (m) meta[key] = parseInt(m[1], 10);
  }

  // Array fields
  for (const key of ['keywords', 'topics', 'tags']) {
    const m = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`));
    if (m) {
      meta[key] = m[1]
        .split(',')
        .map(s => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    }
  }

  return meta;
}

// Main
const tsxFiles = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.tsx') && f !== 'template.tsx');

console.log(`Scanning ${tsxFiles.length} post files...`);

const posts = [];

for (const file of tsxFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const meta = extractMetadata(content);

  if (!meta) {
    console.warn(`  SKIP ${file} (no metadata export found)`);
    continue;
  }

  const stats = fs.statSync(filePath);

  posts.push({
    slug: meta.slug || file.replace(/\.tsx$/, ''),
    title: meta.title || '',
    description: meta.description || '',
    publishedDate: meta.publishedDate || '',
    modifiedDate: meta.modifiedDate || '',
    isDraft: meta.isDraft || false,
    isFeatured: meta.isFeatured || false,
    priority: meta.priority || 0,
    category: meta.category || '',
    series: meta.series || '',
    topics: meta.topics || [],
    tags: meta.tags || [],
    keywords: meta.keywords || [],
    canonicalUrl: meta.canonicalUrl || '',
    headerImage: meta.headerImage || '',
    wordCount: content.split(/\s+/).length, // rough approximation from JSX
    fileSize: stats.size,
    fileModified: stats.mtime.toISOString(),
  });

  console.log(`  OK  ${meta.slug}`);
}

// Sort by published date (newest first), then priority
posts.sort((a, b) => {
  const dateA = new Date(a.publishedDate);
  const dateB = new Date(b.publishedDate);
  if (dateA.getTime() !== dateB.getTime()) return dateB - dateA;
  return (b.priority || 0) - (a.priority || 0);
});

const index = {
  generatedAt: new Date().toISOString(),
  count: posts.length,
  posts,
};

fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
console.log(`\nWrote ${INDEX_FILE} with ${posts.length} posts.`);
