// Utilities for managing frontmatter in markdown files

import { PostMetadata } from './post-metadata';

/**
 * Generate frontmatter YAML from PostMetadata
 */
export function generateFrontmatter(metadata: PostMetadata): string {
  const frontmatter: Record<string, any> = {};
  
  // Only include non-default values
  if (metadata.title && metadata.title !== metadata.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) {
    frontmatter.title = metadata.title;
  }
  
  if (metadata.description) {
    frontmatter.description = metadata.description;
  }
  
  if (metadata.publishedDate) {
    frontmatter.publishedDate = metadata.publishedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  if (metadata.modifiedDate) {
    frontmatter.modifiedDate = metadata.modifiedDate.toISOString().split('T')[0];
  }
  
  if (metadata.lastReviewedDate) {
    frontmatter.lastReviewedDate = metadata.lastReviewedDate.toISOString().split('T')[0];
  }
  
  if (metadata.keywords && metadata.keywords.length > 0) {
    frontmatter.keywords = metadata.keywords;
  }
  
  if (metadata.topics && metadata.topics.length > 0) {
    frontmatter.topics = metadata.topics;
  }
  
  if (metadata.tags && metadata.tags.length > 0) {
    frontmatter.tags = metadata.tags;
  }
  
  if (metadata.series) {
    frontmatter.series = metadata.series;
  }
  
  if (metadata.category) {
    frontmatter.category = metadata.category;
  }
  
  if (metadata.socialImage) {
    frontmatter.socialImage = metadata.socialImage;
  }
  
  if (metadata.headerImage) {
    frontmatter.headerImage = metadata.headerImage;
  }
  
  if (metadata.isDraft) {
    frontmatter.isDraft = metadata.isDraft;
  }
  
  if (metadata.isFeatured) {
    frontmatter.isFeatured = metadata.isFeatured;
  }
  
  if (metadata.priority && metadata.priority !== 0) {
    frontmatter.priority = metadata.priority;
  }
  
  if (metadata.canonicalUrl) {
    frontmatter.canonicalUrl = metadata.canonicalUrl;
  }
  
  if (metadata.language && metadata.language !== 'en-US') {
    frontmatter.language = metadata.language;
  }
  
  // Convert to YAML string
  const yamlLines = ['---'];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      yamlLines.push(`${key}:`);
      for (const item of value) {
        yamlLines.push(`  - ${item}`);
      }
    } else if (typeof value === 'string' && value.includes(':')) {
      yamlLines.push(`${key}: "${value}"`);
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  }
  
  yamlLines.push('---');
  
  return yamlLines.join('\n') + '\n';
}

/**
 * Add frontmatter to markdown content
 */
export function addFrontmatterToContent(content: string, metadata: PostMetadata): string {
  const frontmatter = generateFrontmatter(metadata);
  return frontmatter + content;
}

/**
 * Update frontmatter in existing markdown content
 */
export function updateFrontmatterInContent(content: string, metadata: PostMetadata): string {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    // Replace existing frontmatter
    const markdownContent = match[2];
    return addFrontmatterToContent(markdownContent, metadata);
  } else {
    // Add new frontmatter
    return addFrontmatterToContent(content, metadata);
  }
}

/**
 * Create a template frontmatter for new posts
 */
export function createPostTemplate(
  slug: string, 
  title: string, 
  description?: string,
  options: {
    isDraft?: boolean;
    topics?: string[];
    tags?: string[];
    series?: string;
    category?: string;
  } = {}
): string {
  const metadata: PostMetadata = {
    slug,
    title,
    description: description || `Read about ${title} - Software engineering insights and technical articles from CyberWorld Builders.`,
    publishedDate: new Date(),
    modifiedDate: new Date(),
    lastReviewedDate: new Date(),
    keywords: [],
    topics: options.topics || [],
    tags: options.tags || [],
    series: options.series,
    category: options.category,
    isDraft: options.isDraft || true,
    isFeatured: false,
    priority: 0,
    language: 'en-US',
    wordCount: 0,
    readingTime: 0,
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
  
  return generateFrontmatter(metadata);
}

/**
 * Validate frontmatter structure
 */
export function validateFrontmatter(frontmatter: Record<string, any>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (frontmatter.publishedDate) {
    const date = new Date(frontmatter.publishedDate);
    if (isNaN(date.getTime())) {
      errors.push('publishedDate must be a valid date');
    }
  }
  
  if (frontmatter.modifiedDate) {
    const date = new Date(frontmatter.modifiedDate);
    if (isNaN(date.getTime())) {
      errors.push('modifiedDate must be a valid date');
    }
  }
  
  if (frontmatter.lastReviewedDate) {
    const date = new Date(frontmatter.lastReviewedDate);
    if (isNaN(date.getTime())) {
      errors.push('lastReviewedDate must be a valid date');
    }
  }
  
  // Check array fields
  const arrayFields = ['keywords', 'topics', 'tags'];
  for (const field of arrayFields) {
    if (frontmatter[field] && !Array.isArray(frontmatter[field])) {
      errors.push(`${field} must be an array`);
    }
  }
  
  // Check boolean fields
  const booleanFields = ['isDraft', 'isFeatured'];
  for (const field of booleanFields) {
    if (frontmatter[field] !== undefined && typeof frontmatter[field] !== 'boolean') {
      errors.push(`${field} must be a boolean`);
    }
  }
  
  // Check numeric fields
  if (frontmatter.priority !== undefined && typeof frontmatter.priority !== 'number') {
    errors.push('priority must be a number');
  }
  
  // Warnings
  if (!frontmatter.description) {
    warnings.push('Consider adding a description for better SEO');
  }
  
  if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
    warnings.push('Consider adding keywords for better SEO');
  }
  
  if (!frontmatter.topics || frontmatter.topics.length === 0) {
    warnings.push('Consider adding topics for better content organization');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
