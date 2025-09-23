#!/usr/bin/env node

/**
 * Metadata Management Utilities
 * 
 * This script provides utilities for managing blog post metadata:
 * - Validate frontmatter in all posts
 * - Find posts needing review
 * - Generate frontmatter templates
 * - Update lastReviewedDate for old posts
 */

const fs = require('fs').promises;
const path = require('path');

const POSTS_DIR = path.join(process.cwd(), 'app/blog/posts/markdown');

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content };
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Parse arrays (comma-separated or YAML list)
    if (value.includes(',') || line.includes('- ')) {
      if (line.includes('- ')) {
        // YAML list format
        const listItems = lines
          .filter(l => l.trim().startsWith('- '))
          .map(l => l.trim().substring(2).trim());
        frontmatter[key] = listItems;
      } else {
        frontmatter[key] = value.split(',').map(v => v.trim());
      }
    }
    // Parse booleans
    else if (value.toLowerCase() === 'true') {
      frontmatter[key] = true;
    }
    else if (value.toLowerCase() === 'false') {
      frontmatter[key] = false;
    }
    // Parse numbers
    else if (!isNaN(Number(value))) {
      frontmatter[key] = Number(value);
    }
    // Parse dates
    else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      frontmatter[key] = new Date(value);
    }
    // Default to string
    else {
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, content: markdownContent };
}

// Get all markdown files
async function getAllPosts() {
  const filenames = await fs.readdir(POSTS_DIR);
  
  const posts = await Promise.all(
    filenames
      .filter(filename => filename.endsWith('.md') && !filename.startsWith('.'))
      .map(async filename => {
        const filePath = path.join(POSTS_DIR, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const stats = await fs.stat(filePath);
        const slug = filename.replace(/\.md$/, '');
        
        const { frontmatter } = parseFrontmatter(content);
        
        return {
          slug,
          filename,
          filePath,
          content,
          frontmatter,
          stats
        };
      })
  );
  
  return posts;
}

// Validate frontmatter
function validateFrontmatter(frontmatter, slug) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!frontmatter.publishedDate) {
    warnings.push('Missing publishedDate - will use file creation date');
  }
  
  if (!frontmatter.description) {
    warnings.push('Missing description - will extract from content');
  }
  
  if (!frontmatter.keywords || frontmatter.keywords.length === 0) {
    warnings.push('Missing keywords - consider adding for better SEO');
  }
  
  if (!frontmatter.topics || frontmatter.topics.length === 0) {
    warnings.push('Missing topics - consider adding for better categorization');
  }
  
  // Check date formats
  if (frontmatter.publishedDate) {
    const date = new Date(frontmatter.publishedDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid publishedDate format');
    }
  }
  
  if (frontmatter.modifiedDate) {
    const date = new Date(frontmatter.modifiedDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid modifiedDate format');
    }
  }
  
  if (frontmatter.lastReviewedDate) {
    const date = new Date(frontmatter.lastReviewedDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid lastReviewedDate format');
    }
  }
  
  return { errors, warnings };
}

// Find posts needing review
function findPostsNeedingReview(posts, daysSinceReview = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceReview);
  
  return posts.filter(post => {
    const lastReviewed = post.frontmatter.lastReviewedDate || 
                        post.frontmatter.publishedDate || 
                        post.stats.ctime;
    return new Date(lastReviewed) < cutoffDate;
  });
}

// Generate frontmatter template
function generateFrontmatterTemplate(slug, title, options = {}) {
  const today = new Date().toISOString().split('T')[0];
  
  return `---
title: "${title}"
description: "SEO-friendly description for your post"
publishedDate: ${today}
modifiedDate: ${today}
lastReviewedDate: ${today}
keywords:
  - keyword1
  - keyword2
  - keyword3
topics:
  - AI & Automation
  - Development & Tools
tags:
  - specific-tag
  - another-tag
series: "${options.series || ''}"
category: "${options.category || 'Technology'}"
socialImage: "/images/your-social-image.jpg"
headerImage: "/images/your-header-image.jpg"
isDraft: ${options.isDraft || true}
isFeatured: ${options.isFeatured || false}
priority: ${options.priority || 0}
canonicalUrl: "https://cyberworldbuilders.com/blog/${slug}"
language: "en-US"
---`;
}

// Main CLI interface
async function main() {
  const command = process.argv[2];
  
  try {
    const posts = await getAllPosts();
    
    switch (command) {
      case 'validate':
        console.log('🔍 Validating frontmatter in all posts...\n');
        
        let totalErrors = 0;
        let totalWarnings = 0;
        
        for (const post of posts) {
          const { errors, warnings } = validateFrontmatter(post.frontmatter, post.slug);
          
          if (errors.length > 0 || warnings.length > 0) {
            console.log(`📄 ${post.slug}:`);
            
            if (errors.length > 0) {
              console.log('  ❌ Errors:');
              errors.forEach(error => console.log(`    - ${error}`));
              totalErrors += errors.length;
            }
            
            if (warnings.length > 0) {
              console.log('  ⚠️  Warnings:');
              warnings.forEach(warning => console.log(`    - ${warning}`));
              totalWarnings += warnings.length;
            }
            
            console.log('');
          }
        }
        
        console.log(`\n📊 Summary: ${totalErrors} errors, ${totalWarnings} warnings across ${posts.length} posts`);
        break;
        
      case 'review':
        const daysSinceReview = parseInt(process.argv[3]) || 90;
        console.log(`🔍 Finding posts needing review (older than ${daysSinceReview} days)...\n`);
        
        const postsNeedingReview = findPostsNeedingReview(posts, daysSinceReview);
        
        if (postsNeedingReview.length === 0) {
          console.log('✅ All posts are up to date!');
        } else {
          console.log(`📋 ${postsNeedingReview.length} posts need review:`);
          postsNeedingReview.forEach(post => {
            const lastReviewed = post.frontmatter.lastReviewedDate || 
                               post.frontmatter.publishedDate || 
                               post.stats.ctime;
            const daysAgo = Math.floor((new Date() - new Date(lastReviewed)) / (1000 * 60 * 60 * 24));
            console.log(`  - ${post.slug} (${daysAgo} days ago)`);
          });
        }
        break;
        
      case 'template':
        const slug = process.argv[3];
        const title = process.argv[4] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (!slug) {
          console.log('❌ Please provide a slug: node scripts/metadata-utils.js template <slug> [title]');
          process.exit(1);
        }
        
        console.log('📝 Frontmatter template:');
        console.log(generateFrontmatterTemplate(slug, title));
        break;
        
      case 'update-review-dates':
        console.log('🔄 Updating lastReviewedDate for all posts...\n');
        
        const today = new Date().toISOString().split('T')[0];
        let updatedCount = 0;
        
        for (const post of posts) {
          const { frontmatter, content } = parseFrontmatter(post.content);
          
          // Update lastReviewedDate
          frontmatter.lastReviewedDate = today;
          
          // Regenerate content with updated frontmatter
          const newContent = generateFrontmatterTemplate(post.slug, frontmatter.title || post.slug, frontmatter) + content;
          
          await fs.writeFile(post.filePath, newContent, 'utf8');
          console.log(`✅ Updated ${post.slug}`);
          updatedCount++;
        }
        
        console.log(`\n📊 Updated ${updatedCount} posts`);
        break;
        
      default:
        console.log(`
📚 Metadata Management Utilities

Usage: node scripts/metadata-utils.js <command> [options]

Commands:
  validate                    - Validate frontmatter in all posts
  review [days]              - Find posts needing review (default: 90 days)
  template <slug> [title]    - Generate frontmatter template
  update-review-dates        - Update lastReviewedDate for all posts

Examples:
  node scripts/metadata-utils.js validate
  node scripts/metadata-utils.js review 60
  node scripts/metadata-utils.js template my-new-post "My New Post"
  node scripts/metadata-utils.js update-review-dates
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseFrontmatter,
  getAllPosts,
  validateFrontmatter,
  findPostsNeedingReview,
  generateFrontmatterTemplate
};
