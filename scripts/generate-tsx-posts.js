#!/usr/bin/env node

/**
 * Generates individual TSX files from markdown posts
 * This creates a more efficient and modular approach than embedding everything in one file
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'app/blog/posts/markdown');
const OUTPUT_DIR = path.join(process.cwd(), 'app/blog/posts/generated');
const INDEX_FILE = path.join(process.cwd(), 'lib/generated-posts-index.ts');

console.log('🚀 Starting TSX post generation...');
console.log(`📁 Posts directory: ${POSTS_DIR}`);
console.log(`📁 Output directory: ${OUTPUT_DIR}`);
console.log(`📄 Index file: ${INDEX_FILE}`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  console.error(`❌ Posts directory not found: ${POSTS_DIR}`);
  process.exit(1);
}

// Get all markdown files
const markdownFiles = fs.readdirSync(POSTS_DIR)
  .filter(file => file.endsWith('.md'))
  .filter(file => !file.includes('example-with-frontmatter'))
  .filter(file => !file.includes('frontmatter-example'));

console.log(`📝 Found ${markdownFiles.length} markdown files`);

const generatedPosts = [];

for (const file of markdownFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const slug = file.replace('.md', '');
  
  try {
    // Read and parse the markdown file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Process the content (remove frontmatter, clean up)
    const cleanContent = content.trim();
    
    // Create the TSX file content
    const tsxContent = `/**
 * Generated from: ${file}
 * DO NOT EDIT MANUALLY - this file is generated automatically
 * Last generated: ${new Date().toISOString()}
 */

import { PostWithMetadata } from '@/lib/post-metadata';

export const postData: PostWithMetadata = {
  slug: '${slug}',
  content: ${JSON.stringify(cleanContent)},
  metadata: {
    title: ${JSON.stringify(frontmatter.title || slug.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()))},
    description: ${JSON.stringify(frontmatter.description || `Read about ${frontmatter.title || slug.replace(/-/g, ' ')} - Software engineering insights and technical articles from CyberWorld Builders.`)},
    slug: '${slug}',
    publishedDate: new Date('${frontmatter.publishedDate ? new Date(frontmatter.publishedDate).toISOString() : stats.birthtime.toISOString()}'),
    modifiedDate: new Date('${frontmatter.modifiedDate ? new Date(frontmatter.modifiedDate).toISOString() : stats.mtime.toISOString()}'),
    lastReviewedDate: new Date('${frontmatter.lastReviewedDate ? new Date(frontmatter.lastReviewedDate).toISOString() : stats.mtime.toISOString()}'),
    isDraft: ${frontmatter.isDraft || false},
    isFeatured: ${frontmatter.isFeatured || false},
    priority: ${frontmatter.priority || 0},
    category: ${JSON.stringify(frontmatter.category || 'Technology')},
    series: ${JSON.stringify(frontmatter.series || '')},
    topics: ${JSON.stringify(frontmatter.topics || [])},
    tags: ${JSON.stringify(frontmatter.tags || [])},
    keywords: ${JSON.stringify(frontmatter.keywords || [])},
    wordCount: ${frontmatter.wordCount || cleanContent.split(/\\s+/).length},
    readingTime: ${Math.ceil((frontmatter.wordCount || cleanContent.split(/\\s+/).length) / 200)},
    language: ${JSON.stringify(frontmatter.language || 'en-US')},
  },
  fileStats: {
    ctime: new Date('${stats.birthtime.toISOString()}'),
    mtime: new Date('${stats.mtime.toISOString()}'),
    size: ${stats.size},
  }
};

export default postData;
`;

    // Write the TSX file
    const outputPath = path.join(OUTPUT_DIR, `${slug}.tsx`);
    fs.writeFileSync(outputPath, tsxContent, 'utf8');
    
    // Store metadata for index generation
    generatedPosts.push({
      slug,
      title: frontmatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      publishedDate: frontmatter.publishedDate ? new Date(frontmatter.publishedDate).toISOString() : stats.birthtime.toISOString(),
      modifiedDate: frontmatter.modifiedDate ? new Date(frontmatter.modifiedDate).toISOString() : stats.mtime.toISOString(),
      lastReviewedDate: frontmatter.lastReviewedDate ? new Date(frontmatter.lastReviewedDate).toISOString() : stats.mtime.toISOString(),
      isDraft: frontmatter.isDraft || false,
      isFeatured: frontmatter.isFeatured || false,
      priority: frontmatter.priority || 0,
      category: frontmatter.category || 'Technology',
      series: frontmatter.series || '',
      topics: frontmatter.topics || [],
      tags: frontmatter.tags || [],
      keywords: frontmatter.keywords || [],
      wordCount: frontmatter.wordCount || cleanContent.split(/\s+/).length,
      fileSize: stats.size,
      fileModified: stats.mtime.toISOString(),
    });
    
    console.log(`✅ Generated: ${slug}.tsx`);
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

// Sort posts by published date (newest first) and priority
generatedPosts.sort((a, b) => {
  const dateA = new Date(a.publishedDate);
  const dateB = new Date(b.publishedDate);
  
  if (dateA.getTime() !== dateB.getTime()) {
    return dateB.getTime() - dateA.getTime(); // Newest first
  }
  
  return (b.priority || 0) - (a.priority || 0); // Higher priority first
});

// Generate the index file
const indexContent = `/**
 * Generated posts index
 * This file is generated automatically during the build process
 * DO NOT EDIT MANUALLY - it will be overwritten on the next build
 */

export interface PostIndexEntry {
  slug: string;
  title: string;
  publishedDate: string;
  modifiedDate: string;
  lastReviewedDate: string;
  isDraft: boolean;
  isFeatured: boolean;
  priority: number;
  category: string;
  series: string;
  topics: string[];
  tags: string[];
  keywords: string[];
  wordCount: number;
  fileSize: number;
  fileModified: string;
}

export const postsIndex: PostIndexEntry[] = ${JSON.stringify(generatedPosts, null, 2)};

export const publishedPosts = postsIndex.filter(post => !post.isDraft);

export const featuredPosts = postsIndex.filter(post => post.isFeatured);

export const postsByTopic = postsIndex.reduce((acc, post) => {
  post.topics.forEach(topic => {
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(post);
  });
  return acc;
}, {} as Record<string, PostIndexEntry[]>);

export const postsByTag = postsIndex.reduce((acc, post) => {
  post.tags.forEach(tag => {
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(post);
  });
  return acc;
}, {} as Record<string, PostIndexEntry[]>);

// Helper function to get post data dynamically
export async function getPostData(slug: string) {
  try {
    const postModule = await import(\`@/app/blog/posts/generated/\${slug}.tsx\`);
    return postModule.postData;
  } catch (error) {
    console.error(\`Error loading post \${slug}:\`, error);
    return null;
  }
}

// Helper function to get all posts data
export async function getAllPostsData() {
  const posts = [];
  for (const postIndex of publishedPosts) {
    const postData = await getPostData(postIndex.slug);
    if (postData) {
      posts.push(postData);
    }
  }
  return posts;
}
`;

// Write the index file
fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');

console.log(`✅ Generated posts index: ${INDEX_FILE}`);
console.log(`📊 Generated ${generatedPosts.length} TSX files`);
console.log(`📈 Published posts: ${generatedPosts.filter(p => !p.isDraft).length}`);
console.log(`⭐ Featured posts: ${generatedPosts.filter(p => p.isFeatured).length}`);

// Verify files were created
if (fs.existsSync(INDEX_FILE)) {
  const stats = fs.statSync(INDEX_FILE);
  console.log(`✅ Index file verification: ${INDEX_FILE} exists (${stats.size} bytes)`);
} else {
  console.error(`❌ Failed to create index file: ${INDEX_FILE}`);
  process.exit(1);
}

console.log('🎉 TSX post generation completed successfully!');
