#!/usr/bin/env node

/**
 * Tag Page Generation Script
 * 
 * This script ensures all tag pages are properly generated and accessible.
 * It can be run as part of the build process or SEO maintenance.
 */

const fs = require('fs');
const path = require('path');

console.log('🏷️  Starting tag page generation...');

async function generateTagPages() {
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
    
    // Generate tag page data
    const tagPages = [];
    
    // Process tags
    Array.from(allTags).forEach(tag => {
      const encodedTag = encodeURIComponent(tag);
      const postsWithTag = postIndex.posts.filter(post => 
        post.tags && post.tags.includes(tag)
      );
      
      tagPages.push({
        tag: tag,
        encodedTag: encodedTag,
        url: `/blog/tag/${encodedTag}`,
        postCount: postsWithTag.length,
        posts: postsWithTag.map(post => ({
          slug: post.slug,
          title: post.title,
          publishedDate: post.publishedDate
        }))
      });
    });
    
    // Process keywords
    Array.from(allKeywords).forEach(keyword => {
      const encodedKeyword = encodeURIComponent(keyword);
      const postsWithKeyword = postIndex.posts.filter(post => 
        post.keywords && post.keywords.includes(keyword)
      );
      
      tagPages.push({
        tag: keyword,
        encodedTag: encodedKeyword,
        url: `/blog/tag/${encodedKeyword}`,
        postCount: postsWithKeyword.length,
        posts: postsWithKeyword.map(post => ({
          slug: post.slug,
          title: post.title,
          publishedDate: post.publishedDate
        }))
      });
    });
    
    // Remove duplicates (tags and keywords might overlap)
    const uniqueTagPages = new Map();
    tagPages.forEach(tagPage => {
      const key = tagPage.encodedTag;
      if (!uniqueTagPages.has(key) || uniqueTagPages.get(key).postCount < tagPage.postCount) {
        uniqueTagPages.set(key, tagPage);
      }
    });
    
    const finalTagPages = Array.from(uniqueTagPages.values());
    
    console.log(`📄 Generated ${finalTagPages.length} unique tag pages`);
    
    // Generate tag page index
    const tagPageIndex = {
      generatedAt: new Date().toISOString(),
      totalTagPages: finalTagPages.length,
      tagPages: finalTagPages.sort((a, b) => b.postCount - a.postCount) // Sort by post count
    };
    
    // Save tag page index
    const indexPath = path.join(process.cwd(), 'lib', 'tag-pages-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(tagPageIndex, null, 2));
    console.log(`📁 Tag pages index saved: ${indexPath}`);
    
    // Generate summary report
    const summary = {
      totalTagPages: finalTagPages.length,
      totalPosts: postIndex.posts.length,
      averagePostsPerTag: Math.round((finalTagPages.reduce((sum, tp) => sum + tp.postCount, 0) / finalTagPages.length) * 100) / 100,
      topTags: finalTagPages
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 10)
        .map(tp => ({ tag: tp.tag, postCount: tp.postCount }))
    };
    
    console.log('\n📈 Tag Pages Summary:');
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
      tagPages: finalTagPages.length
    };
    
  } catch (error) {
    console.error('❌ Error generating tag pages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run generation
generateTagPages().then(result => {
  if (result.success) {
    console.log('\n🎉 Tag page generation completed successfully!');
    console.log(`📊 Generated ${result.tagPages} tag pages`);
    process.exit(0);
  } else {
    console.log('\n❌ Tag page generation failed.');
    console.log(`Error: ${result.error}`);
    process.exit(1);
  }
});
