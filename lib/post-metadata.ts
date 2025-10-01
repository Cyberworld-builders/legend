// Post metadata system for blog posts
// Supports frontmatter parsing and provides structured metadata

export interface PostMetadata {
  // Core post information
  title?: string;
  description?: string;
  slug: string;
  
  // Dates and timing
  publishedDate?: Date;
  modifiedDate?: Date;
  lastReviewedDate?: Date;
  
  // SEO and social
  keywords?: string[];
  canonicalUrl?: string;
  socialImage?: string;
  headerImage?: string;
  
  // Content categorization
  topics?: string[];
  tags?: string[];
  series?: string;
  category?: string;
  
  // Publishing control
  isDraft?: boolean;
  isFeatured?: boolean;
  priority?: number; // For ordering
  
  // Author override (optional)
  author?: {
    name?: string;
    email?: string;
    url?: string;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
  
  // Future expansion
  customFields?: Record<string, unknown>;
  
  // Technical metadata
  wordCount?: number;
  readingTime?: number; // in minutes
  language?: string;
}

export interface PostWithMetadata {
  slug: string;
  content: string;
  metadata: PostMetadata;
  fileStats: {
    mtime: Date;
    ctime: Date;
    size: number;
  };
}

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

// Default metadata values
const DEFAULT_METADATA: Partial<PostMetadata> = {
  language: 'en-US',
  isDraft: false,
  isFeatured: false,
  priority: 0,
  author: {
    name: 'Jay Long',
    email: 'contact@cyberworldbuilders.com',
    url: 'https://cyberworldbuilders.com',
    social: {
      twitter: 'https://x.com/cyberbuilders',
      github: 'https://github.com/CyberWorld-builders',
    }
  }
};

/**
 * Safely extract a value from frontmatter with type checking
 */
function safeExtract<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null) {
    return fallback;
  }
  return value as T;
}

/**
 * Safely extract a string value from frontmatter
 */
function safeExtractString(value: unknown, fallback: string): string {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
}

/**
 * Safely extract a date value from frontmatter
 */
function safeExtractDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Safely extract an array value from frontmatter
 */
function safeExtractArray<T>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return fallback;
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content };
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  // Simple YAML parser for basic key-value pairs and arrays
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Check if this is an array item (starts with -)
    if (trimmed.startsWith('- ')) {
      if (!inArray) {
        // Start of a new array
        inArray = true;
        currentArray = [];
      }
      const arrayValue = trimmed.substring(2).trim();
      // Remove quotes if present
      const cleanValue = (arrayValue.startsWith('"') && arrayValue.endsWith('"')) || 
                        (arrayValue.startsWith("'") && arrayValue.endsWith("'"))
                        ? arrayValue.slice(1, -1) : arrayValue;
      currentArray.push(cleanValue);
      continue;
    }
    
    // If we were in an array and this line doesn't start with -, save the array
    if (inArray) {
      frontmatter[currentKey] = currentArray;
      inArray = false;
      currentArray = [];
    }
    
    // Check if this is a key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // If value is empty, it might be the start of an array
    if (!value) {
      currentKey = key;
      // Check if next line starts with -
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        inArray = true;
        currentArray = [];
        continue;
      }
    }
    
    // Parse arrays (comma-separated)
    if (value.includes(',')) {
      frontmatter[key] = value.split(',').map(v => v.trim());
    }
    // Parse booleans
    else if (value.toLowerCase() === 'true') {
      frontmatter[key] = true;
    }
    else if (value.toLowerCase() === 'false') {
      frontmatter[key] = false;
    }
    // Parse numbers
    else if (!isNaN(Number(value)) && value !== '') {
      frontmatter[key] = Number(value);
    }
    // Parse dates
    else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      frontmatter[key] = new Date(value);
    }
    // Default to string
    else if (value) {
      frontmatter[key] = value;
    }
  }
  
  // Handle case where file ends with an array
  if (inArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }
  
  return { frontmatter, content: markdownContent };
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, slug: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Extract description from markdown content
 */
function extractDescription(content: string, title: string): string {
  const descriptionMatch = content.match(/^##\s+Overview\s*\n\n([\s\S]+?)(?:\n\n|$)/) || 
                          content.match(/^([\s\S]+?)(?:\n\n|$)/);
  return descriptionMatch ? 
    descriptionMatch[1].replace(/\n/g, ' ').substring(0, 160) + '...' :
    `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`;
}

/**
 * Calculate reading time based on word count
 */
function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Parse post metadata from markdown file content
 */
export function parsePostMetadata(
  slug: string, 
  content: string, 
  fileStats: { mtime: Date; ctime: Date; size: number }
): PostWithMetadata {
  const { frontmatter, content: markdownContent } = parseFrontmatter(content);
  
  // Extract title and description from content if not in frontmatter
  const title = safeExtractString(frontmatter.title, extractTitle(markdownContent, slug));
  const description = safeExtractString(frontmatter.description, extractDescription(markdownContent, title));
  
  // Calculate word count and reading time
  const wordCount = markdownContent.split(/\s+/).length;
  const readingTime = calculateReadingTime(wordCount);
  
  // Build metadata object
  const metadata: PostMetadata = {
    ...DEFAULT_METADATA,
    slug,
    title,
    description,
    wordCount,
    readingTime,
    
    // Use frontmatter values or fallback to file stats
    publishedDate: safeExtractDate(frontmatter.publishedDate || frontmatter.published, fileStats.ctime),
    modifiedDate: safeExtractDate(frontmatter.modifiedDate || frontmatter.modified, fileStats.mtime),
    lastReviewedDate: safeExtractDate(frontmatter.lastReviewedDate || frontmatter.lastReviewed, fileStats.mtime),
    
    // SEO fields
    keywords: safeExtractArray(frontmatter.keywords || frontmatter.tags, []),
    canonicalUrl: safeExtractString(frontmatter.canonicalUrl || frontmatter.canonical, ''),
    socialImage: safeExtractString(frontmatter.socialImage || frontmatter.image, ''),
    headerImage: safeExtractString(frontmatter.headerImage || frontmatter.hero, ''),
    
    // Content categorization
    topics: safeExtractArray(frontmatter.topics, []),
    tags: safeExtractArray(frontmatter.tags, []),
    series: safeExtractString(frontmatter.series, ''),
    category: safeExtractString(frontmatter.category, ''),
    
    // Publishing control
    isDraft: safeExtract(frontmatter.isDraft || frontmatter.draft, false),
    isFeatured: safeExtract(frontmatter.isFeatured || frontmatter.featured, false),
    priority: safeExtract(frontmatter.priority, 5),
    
    // Author override
    author: frontmatter.author ? {
      ...DEFAULT_METADATA.author,
      ...frontmatter.author
    } : DEFAULT_METADATA.author,
    
    // Custom fields
    customFields: safeExtract(frontmatter.custom || frontmatter.customFields, {}),
    
    // Technical
    language: safeExtractString(frontmatter.language, 'en-US'),
  };
  
  return {
    slug,
    content: markdownContent,
    metadata,
    fileStats
  };
}

/**
 * Get all posts with metadata
 */
export async function getAllPostsWithMetadata(): Promise<PostWithMetadata[]> {
  // Use hard-coded post index data instead of reading from file
  // This eliminates file system dependencies in serverless environments
  const { hardcodedPosts } = await import('./hardcoded-posts');
  const postsFromIndex: PostIndexEntry[] = hardcodedPosts;
  
  console.log(`✅ Using hard-coded post index with ${postsFromIndex.length} posts`);
  console.log(`📋 First few posts:`, postsFromIndex.slice(0, 3).map(p => p.slug));
  console.log(`🕐 Cache bust timestamp: ${Date.now()}`);
  
  console.log(`Processing ${postsFromIndex.length} posts`);
  
  const allPosts = await Promise.all(
    postsFromIndex.map(async (postMeta) => {
      try {
        // Try to load the full post with content
        const post = await getPostWithMetadata(postMeta.slug);
        if (post) {
          // Use the metadata from the index as a fallback/override
          return {
            ...post,
            metadata: {
              ...post.metadata,
              // Override with index metadata where available
              publishedDate: new Date(postMeta.publishedDate),
              modifiedDate: new Date(postMeta.modifiedDate),
              lastReviewedDate: new Date(postMeta.lastReviewedDate),
              isDraft: postMeta.isDraft,
              isFeatured: postMeta.isFeatured,
              priority: postMeta.priority,
              category: postMeta.category || post.metadata.category,
              series: postMeta.series || post.metadata.series,
              topics: postMeta.topics.length > 0 ? postMeta.topics : post.metadata.topics,
              tags: postMeta.tags.length > 0 ? postMeta.tags : post.metadata.tags,
              keywords: postMeta.keywords.length > 0 ? postMeta.keywords : post.metadata.keywords,
              wordCount: postMeta.wordCount || post.metadata.wordCount,
            }
          };
        } else {
          // If we can't load the full post, create a minimal post from index data
          console.warn(`Could not load post: ${postMeta.slug}, using index data only`);
          return {
            slug: postMeta.slug,
            content: '', // Empty content for index-only posts
            metadata: {
              title: postMeta.title || postMeta.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: '',
              slug: postMeta.slug,
              publishedDate: new Date(postMeta.publishedDate),
              modifiedDate: new Date(postMeta.modifiedDate),
              lastReviewedDate: new Date(postMeta.lastReviewedDate),
              isDraft: postMeta.isDraft,
              isFeatured: postMeta.isFeatured,
              priority: postMeta.priority,
              category: postMeta.category,
              series: postMeta.series,
              topics: postMeta.topics,
              tags: postMeta.tags,
              keywords: postMeta.keywords,
              wordCount: postMeta.wordCount,
              readingTime: Math.ceil((postMeta.wordCount || 0) / 200), // Estimate reading time
              language: 'en-US',
            },
            fileStats: {
              ctime: new Date(postMeta.fileModified),
              mtime: new Date(postMeta.fileModified),
              size: postMeta.fileSize,
            }
          };
        }
      } catch (error) {
        console.error(`Error loading post ${postMeta.slug}:`, error instanceof Error ? error.message : String(error));
        return null;
      }
    })
  );
  
  // Filter out null results and drafts in production
  const validPosts = allPosts.filter(post => post !== null) as PostWithMetadata[];
  const publishedPosts = validPosts.filter(post => 
    process.env.NODE_ENV === 'development' || !post.metadata.isDraft
  );
  
  console.log(`📊 Final result: ${validPosts.length} valid posts, ${publishedPosts.length} published posts`);
  console.log(`📝 Published post slugs:`, publishedPosts.map(p => p.slug));
  
  // Sort by published date (most recent first), then by priority
  return publishedPosts.sort((a, b) => {
    const dateA = a.metadata.publishedDate || a.fileStats.ctime;
    const dateB = b.metadata.publishedDate || b.fileStats.ctime;
    
    // First sort by date
    const dateComparison = dateB.getTime() - dateA.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then by priority (higher priority first)
    return (b.metadata.priority || 0) - (a.metadata.priority || 0);
  });
}

/**
 * Get a single post with metadata
 */
export async function getPostWithMetadata(slug: string): Promise<PostWithMetadata | null> {
  // Use hard-coded post data instead of reading from file system
  const { hardcodedPosts } = await import('./hardcoded-posts');
  
  // Find the post in our hard-coded data
  const postData = hardcodedPosts.find(post => post.slug === slug);
  
  if (!postData) {
    console.error(`Post not found: ${slug}`);
    return null;
  }
  
  console.log(`Found post data for: ${slug}`);
  
  // Create a PostWithMetadata object from the hard-coded data
  const post: PostWithMetadata = {
    slug: postData.slug,
    content: `# ${postData.title}\n\nThis is a placeholder content for ${postData.title}. The full content would be loaded from the markdown file in a file-based system.`, // Placeholder content
    metadata: {
      title: postData.title,
      description: `Read about ${postData.title} - Software engineering insights and technical articles from CyberWorld Builders.`,
      slug: postData.slug,
      publishedDate: new Date(postData.publishedDate),
      modifiedDate: new Date(postData.modifiedDate),
      lastReviewedDate: new Date(postData.lastReviewedDate),
      isDraft: postData.isDraft,
      isFeatured: postData.isFeatured,
      priority: postData.priority,
      category: postData.category,
      series: postData.series,
      topics: postData.topics,
      tags: postData.tags,
      keywords: postData.keywords,
      wordCount: postData.wordCount,
      readingTime: Math.ceil(postData.wordCount / 200),
      language: 'en-US',
    },
    fileStats: {
      ctime: new Date(postData.fileModified),
      mtime: new Date(postData.fileModified),
      size: postData.fileSize,
    }
  };
  
  return post;
}

/**
 * Get posts that need review based on lastReviewedDate
 */
export function getPostsNeedingReview(posts: PostWithMetadata[], daysSinceReview = 90): PostWithMetadata[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceReview);
  
  return posts.filter(post => {
    const lastReviewed = post.metadata.lastReviewedDate || post.metadata.publishedDate || post.fileStats.ctime;
    return lastReviewed < cutoffDate;
  });
}

/**
 * Get posts by topic/category
 */
export function getPostsByTopic(posts: PostWithMetadata[], topic: string): PostWithMetadata[] {
  return posts.filter(post => 
    post.metadata.topics?.includes(topic) || 
    post.metadata.category === topic ||
    post.metadata.tags?.includes(topic)
  );
}

/**
 * Get related posts based on topics and tags
 */
export function getRelatedPosts(
  currentPost: PostWithMetadata, 
  allPosts: PostWithMetadata[], 
  limit = 3
): PostWithMetadata[] {
  const currentTopics = currentPost.metadata.topics || [];
  const currentTags = currentPost.metadata.tags || [];
  
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      
      // Score based on shared topics
      const sharedTopics = (post.metadata.topics || []).filter(topic => 
        currentTopics.includes(topic)
      );
      score += sharedTopics.length * 3;
      
      // Score based on shared tags
      const sharedTags = (post.metadata.tags || []).filter(tag => 
        currentTags.includes(tag)
      );
      score += sharedTags.length * 2;
      
      // Score based on same series
      if (post.metadata.series && post.metadata.series === currentPost.metadata.series) {
        score += 5;
      }
      
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
  
  return scoredPosts;
}
