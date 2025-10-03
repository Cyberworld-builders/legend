#!/usr/bin/env node

/**
 * Tag TSX Generation Script
 * 
 * This script generates TSX files for tag data to avoid file system access issues
 * in Vercel's serverless environment.
 */

const fs = require('fs');
const path = require('path');

console.log('🏷️  Starting tag TSX generation...');

async function generateTagTSX() {
  try {
    // Load the post index
    const postIndexPath = path.join(process.cwd(), 'lib', 'post-index.json');
    const postIndex = JSON.parse(fs.readFileSync(postIndexPath, 'utf8'));
    
    // Collect all unique tags and keywords
    const allTags = new Set();
    const allKeywords = new Set();
    
    postIndex.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => allTags.add(tag));
      }
      if (post.keywords) {
        post.keywords.forEach(keyword => allKeywords.add(keyword));
      }
    });
    
    console.log(`📊 Found ${allTags.size} unique tags and ${allKeywords.size} unique keywords`);
    
    // Create the generated directory
    const generatedDir = path.join(process.cwd(), 'lib', 'generated-tags');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    
    // Generate tag data for each unique tag/keyword
    const allUniqueTags = new Set([...allTags, ...allKeywords]);
    const tagData = new Map();
    
    allUniqueTags.forEach(tag => {
      const encodedTag = encodeURIComponent(tag);
      const postsWithTag = postIndex.posts.filter(post => 
        (post.tags && post.tags.includes(tag)) || 
        (post.keywords && post.keywords.includes(tag))
      );
      
      // Only create entries for tags that have posts
      if (postsWithTag.length > 0) {
        tagData.set(encodedTag, {
        tag: tag,
        encodedTag: encodedTag,
        url: `/blog/tag/${encodedTag}`,
        postCount: postsWithTag.length,
        posts: postsWithTag.map(post => ({
          slug: post.slug,
          title: Array.isArray(post.title) ? post.title.join(' ') : post.title,
          description: post.description,
          publishedDate: post.publishedDate,
          modifiedDate: post.modifiedDate,
          lastReviewedDate: post.lastReviewedDate,
          readingTime: post.readingTime,
          wordCount: post.wordCount,
          tags: post.tags || [],
          keywords: post.keywords || [],
          topics: post.topics || [],
          category: post.category,
          series: post.series,
          isDraft: post.isDraft,
          isFeatured: post.isFeatured,
          priority: post.priority
        }))
        });
      }
    });
    
    // Generate the main tag index TSX file
    const tagIndexContent = `// Generated tag index - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}

export interface TagPost {
  slug: string;
  title: string;
  description?: string;
  publishedDate: string;
  modifiedDate?: string;
  lastReviewedDate?: string;
  readingTime?: number;
  wordCount?: number;
  tags: string[];
  keywords: string[];
  topics: string[];
  category?: string;
  series?: string;
  isDraft: boolean;
  isFeatured: boolean;
  priority: number;
}

export interface TagData {
  tag: string;
  encodedTag: string;
  url: string;
  postCount: number;
  posts: TagPost[];
}

export interface TagIndex {
  generatedAt: string;
  totalTagPages: number;
  totalPosts: number;
  averagePostsPerTag: number;
  tagData: Map<string, TagData>;
  allTags: string[];
  topTags: Array<{ tag: string; postCount: number }>;
}

// Tag data map
export const tagDataMap = new Map<string, TagData>([
${Array.from(tagData.entries()).map(([encodedTag, data]) => 
  `  ['${encodedTag}', ${JSON.stringify(data, null, 2).replace(/^/gm, '  ')}]`
).join(',\n')}
]);

// All unique tags
export const allTags = [
${Array.from(allUniqueTags).map(tag => `  '${tag}'`).join(',\n')}
];

// Top tags by post count
export const topTags = [
${Array.from(tagData.values())
  .sort((a, b) => b.postCount - a.postCount)
  .slice(0, 20)
  .map(tag => `  { tag: '${tag.tag}', postCount: ${tag.postCount} }`)
  .join(',\n')}
];

// Main tag index
export const tagIndex: TagIndex = {
  generatedAt: '${new Date().toISOString()}',
  totalTagPages: ${tagData.size},
  totalPosts: ${postIndex.posts.length},
  averagePostsPerTag: ${Math.round((Array.from(tagData.values()).reduce((sum, tp) => sum + tp.postCount, 0) / tagData.size) * 100) / 100},
  tagData: tagDataMap,
  allTags: allTags,
  topTags: topTags
};

// Helper functions
export function getTagData(encodedTag: string): TagData | undefined {
  return tagDataMap.get(encodedTag);
}

export function getAllTagData(): TagData[] {
  return Array.from(tagDataMap.values());
}

export function getTagsForPost(postSlug: string): string[] {
  const allTags = new Set<string>();
  tagDataMap.forEach(tagData => {
    if (tagData.posts.some(post => post.slug === postSlug)) {
      allTags.add(tagData.tag);
    }
  });
  return Array.from(allTags);
}

export function getRelatedTags(currentTag: string, limit: number = 10): string[] {
  const currentTagData = tagDataMap.get(encodeURIComponent(currentTag));
  if (!currentTagData) return [];
  
  // Find tags that share posts with the current tag
  const relatedTags = new Map<string, number>();
  
  currentTagData.posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag !== currentTag) {
        relatedTags.set(tag, (relatedTags.get(tag) || 0) + 1);
      }
    });
    post.keywords.forEach(keyword => {
      if (keyword !== currentTag) {
        relatedTags.set(keyword, (relatedTags.get(keyword) || 0) + 1);
      }
    });
  });
  
  return Array.from(relatedTags.entries())
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, limit)
    .map(([tag]) => tag);
}
`;

    // Write the main tag index file
    const indexPath = path.join(generatedDir, 'tag-index.ts');
    fs.writeFileSync(indexPath, tagIndexContent);
    console.log(`📁 Tag index generated: ${indexPath}`);
    
    // Generate individual tag data files for better performance
    const individualTagsDir = path.join(generatedDir, 'individual');
    if (!fs.existsSync(individualTagsDir)) {
      fs.mkdirSync(individualTagsDir, { recursive: true });
    }
    
    // Generate individual tag files
    let generatedFiles = 0;
    for (const [encodedTag, data] of tagData.entries()) {
      const safeFileName = encodedTag.replace(/[^a-zA-Z0-9-_]/g, '_');
      const individualFileContent = `// Generated tag data for: ${data.tag}
// Generated at: ${new Date().toISOString()}

import type { TagData } from '../tag-index';

export const tagData: TagData = ${JSON.stringify(data, null, 2)};

export default tagData;
`;
      
      const individualFilePath = path.join(individualTagsDir, `${safeFileName}.ts`);
      fs.writeFileSync(individualFilePath, individualFileContent);
      generatedFiles++;
    }
    
    console.log(`📄 Generated ${generatedFiles} individual tag files`);
    
    // Generate summary
    const summary = {
      totalTagPages: tagData.size,
      totalPosts: postIndex.posts.length,
      averagePostsPerTag: Math.round((Array.from(tagData.values()).reduce((sum, tp) => sum + tp.postCount, 0) / tagData.size) * 100) / 100,
      topTags: Array.from(tagData.values())
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 10)
        .map(tp => ({ tag: tp.tag, postCount: tp.postCount }))
    };
    
    console.log('\n📈 Tag TSX Generation Summary:');
    console.log(`   Total tag pages: ${summary.totalTagPages}`);
    console.log(`   Total posts: ${summary.totalPosts}`);
    console.log(`   Average posts per tag: ${summary.averagePostsPerTag}`);
    console.log('\n🏆 Top 10 Tags by Post Count:');
    summary.topTags.forEach((tag, index) => {
      console.log(`   ${index + 1}. ${tag.tag} (${tag.postCount} posts)`);
    });
    
    return {
      success: true,
      summary: summary,
      generatedFiles: generatedFiles + 1 // +1 for the main index file
    };
    
  } catch (error) {
    console.error('❌ Error generating tag TSX:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run generation
generateTagTSX().then(result => {
  if (result.success) {
    console.log('\n🎉 Tag TSX generation completed successfully!');
    console.log(`📊 Generated ${result.generatedFiles} files`);
    process.exit(0);
  } else {
    console.log('\n❌ Tag TSX generation failed.');
    console.log(`Error: ${result.error}`);
    process.exit(1);
  }
});
