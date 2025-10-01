#!/usr/bin/env node

/**
 * Pre-processes all markdown files and generates embedded data for production builds
 * This eliminates the need for file system access in serverless environments
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'app/blog/posts/markdown');
const OUTPUT_FILE = path.join(process.cwd(), 'lib/processed-posts.ts');

console.log('🚀 Starting content preprocessing...');
console.log(`📁 Posts directory: ${POSTS_DIR}`);
console.log(`📄 Output file: ${OUTPUT_FILE}`);

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

const processedPosts = [];

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
    
    // Create the processed post object
    const processedPost = {
      slug,
      content: cleanContent,
      metadata: {
        title: frontmatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: frontmatter.description || `Read about ${frontmatter.title || slug.replace(/-/g, ' ')} - Software engineering insights and technical articles from CyberWorld Builders.`,
        slug,
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
        readingTime: Math.ceil((frontmatter.wordCount || cleanContent.split(/\s+/).length) / 200),
        language: frontmatter.language || 'en-US',
        // Commented out image fields since we don't support custom images yet
        // socialImage: frontmatter.socialImage || '',
        // headerImage: frontmatter.headerImage || '',
      },
      fileStats: {
        ctime: stats.birthtime.toISOString(),
        mtime: stats.mtime.toISOString(),
        size: stats.size,
      }
    };
    
    processedPosts.push(processedPost);
    console.log(`✅ Processed: ${slug}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

// Sort posts by published date (newest first) and priority
processedPosts.sort((a, b) => {
  const dateA = new Date(a.metadata.publishedDate);
  const dateB = new Date(b.metadata.publishedDate);
  
  if (dateA.getTime() !== dateB.getTime()) {
    return dateB.getTime() - dateA.getTime(); // Newest first
  }
  
  return (b.metadata.priority || 0) - (a.metadata.priority || 0); // Higher priority first
});

// Generate the TypeScript file
const tsContent = `/**
 * Pre-processed blog posts data
 * This file is generated automatically during the build process
 * DO NOT EDIT MANUALLY - it will be overwritten on the next build
 */

// Define the types inline to avoid import issues
interface PostMetadata {
  title: string;
  description: string;
  slug: string;
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
  readingTime: number;
  language: string;
}

interface FileStats {
  ctime: string;
  mtime: string;
  size: number;
}

interface PostWithMetadata {
  slug: string;
  content: string;
  metadata: PostMetadata;
  fileStats: FileStats;
}

export const processedPosts: PostWithMetadata[] = ${JSON.stringify(processedPosts, null, 2)};

export const processedPostsCount = ${processedPosts.length};

export const publishedPosts = processedPosts.filter(post => !post.metadata.isDraft);

export const featuredPosts = processedPosts.filter(post => post.metadata.isFeatured);

export const postsByTopic = processedPosts.reduce((acc, post) => {
  post.metadata.topics.forEach(topic => {
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(post);
  });
  return acc;
}, {} as Record<string, PostWithMetadata[]>);

export const postsByTag = processedPosts.reduce((acc, post) => {
  post.metadata.tags.forEach(tag => {
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(post);
  });
  return acc;
}, {} as Record<string, PostWithMetadata[]>);
`;

// Write the processed data file
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');

console.log(`✅ Generated processed posts file: ${OUTPUT_FILE}`);
console.log(`📊 Processed ${processedPosts.length} posts`);
console.log(`📈 Published posts: ${processedPosts.filter(p => !p.metadata.isDraft).length}`);
console.log(`⭐ Featured posts: ${processedPosts.filter(p => p.metadata.isFeatured).length}`);

// Verify the file was created
if (fs.existsSync(OUTPUT_FILE)) {
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`✅ File verification: ${OUTPUT_FILE} exists (${stats.size} bytes)`);
} else {
  console.error(`❌ Failed to create output file: ${OUTPUT_FILE}`);
  process.exit(1);
}

console.log('🎉 Content preprocessing completed successfully!');
