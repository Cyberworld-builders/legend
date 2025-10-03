#!/usr/bin/env node

/**
 * Tag JSON Generation Script
 * 
 * This script generates a single JSON file with all tag data,
 * which is more efficient than individual TSX files.
 */

const fs = require('fs');
const path = require('path');

console.log('🏷️  Starting tag JSON generation...');

async function generateTagJSON() {
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
            publishedDate: post.publishedDate,
            wordCount: post.wordCount,
            tags: post.tags || [],
            keywords: post.keywords || []
          }))
        });
      }
    });
    
    // Create the generated directory
    const generatedDir = path.join(process.cwd(), 'lib', 'generated-tags');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    
    // Convert Map to Object for JSON serialization
    const tagDataObject = {};
    tagData.forEach((value, key) => {
      tagDataObject[key] = value;
    });
    
    // Generate the tag data JSON file
    const tagDataJson = {
      generatedAt: new Date().toISOString(),
      totalTagPages: tagData.size,
      totalPosts: postIndex.posts.length,
      averagePostsPerTag: Math.round((Array.from(tagData.values()).reduce((sum, tp) => sum + tp.postCount, 0) / tagData.size) * 100) / 100,
      tagData: tagDataObject,
      allTags: Array.from(allUniqueTags).filter(tag => tagData.has(encodeURIComponent(tag))),
      topTags: Array.from(tagData.values())
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 20)
        .map(tp => ({ tag: tp.tag, postCount: tp.postCount }))
    };
    
    // Write the JSON file
    const jsonPath = path.join(generatedDir, 'tag-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(tagDataJson, null, 2));
    console.log(`📁 Tag data JSON generated: ${jsonPath}`);
    
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
    
    console.log('\n📈 Tag JSON Generation Summary:');
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
      generatedFiles: 1
    };
    
  } catch (error) {
    console.error('❌ Error generating tag JSON:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run generation
generateTagJSON().then(result => {
  if (result.success) {
    console.log('\n🎉 Tag JSON generation completed successfully!');
    console.log(`📊 Generated ${result.generatedFiles} file`);
    process.exit(0);
  } else {
    console.log('\n❌ Tag JSON generation failed.');
    console.log(`Error: ${result.error}`);
    process.exit(1);
  }
});
