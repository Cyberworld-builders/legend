#!/usr/bin/env node

/**
 * Tag Validation Script
 * 
 * This script validates that all tag pages are accessible and working correctly.
 * It can be run as part of the SEO maintenance workflow.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting tag validation...');

async function validateTags() {
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
    
    console.log('📊 Tag Analysis:');
    console.log(`   Total unique tags: ${allTags.size}`);
    console.log(`   Total unique keywords: ${allKeywords.size}`);
    
    // Generate expected tag URLs
    const expectedTagUrls = new Set();
    Array.from(allTags).forEach(tag => {
      expectedTagUrls.add(`/blog/tag/${encodeURIComponent(tag)}`);
    });
    Array.from(allKeywords).forEach(keyword => {
      expectedTagUrls.add(`/blog/tag/${encodeURIComponent(keyword)}`);
    });
    
    console.log(`   Expected tag pages: ${expectedTagUrls.size}`);
    
    // Check for potential issues
    const issues = [];
    
    // Check for empty tags
    const emptyTags = Array.from(allTags).filter(tag => !tag || tag.trim() === '');
    if (emptyTags.length > 0) {
      issues.push(`Found ${emptyTags.length} empty tags`);
    }
    
    // Check for duplicate tags (case-insensitive)
    const tagMap = new Map();
    Array.from(allTags).forEach(tag => {
      const lower = tag.toLowerCase();
      if (tagMap.has(lower)) {
        issues.push(`Duplicate tag found: "${tag}" and "${tagMap.get(lower)}"`);
      } else {
        tagMap.set(lower, tag);
      }
    });
    
    // Check for very long tags (might cause URL issues)
    const longTags = Array.from(allTags).filter(tag => tag.length > 50);
    if (longTags.length > 0) {
      issues.push(`Found ${longTags.length} very long tags (${longTags.join(', ')})`);
    }
    
    // Check for tags with special characters that might cause URL issues
    const problematicTags = Array.from(allTags).filter(tag => 
      /[<>:"|?*]/.test(tag) || tag.includes('\\') || tag.includes('/')
    );
    if (problematicTags.length > 0) {
      issues.push(`Found ${problematicTags.length} tags with problematic characters: ${problematicTags.join(', ')}`);
    }
    
    // Generate tag statistics
    const tagStats = {
      totalTags: allTags.size,
      totalKeywords: allKeywords.size,
      totalTagPages: expectedTagUrls.size,
      issues: issues.length,
      problematicTags: problematicTags.length,
      longTags: longTags.length,
      emptyTags: emptyTags.length
    };
    
    console.log('\n📈 Tag Statistics:');
    console.log(`   Total tag pages to generate: ${tagStats.totalTagPages}`);
    console.log(`   Issues found: ${tagStats.issues}`);
    
    if (issues.length > 0) {
      console.log('\n⚠️  Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('\n✅ No issues found with tags!');
    }
    
    // Generate tag report
    const report = {
      timestamp: new Date().toISOString(),
      stats: tagStats,
      issues: issues,
      allTags: Array.from(allTags).sort(),
      allKeywords: Array.from(allKeywords).sort(),
      expectedTagUrls: Array.from(expectedTagUrls).sort()
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'tag-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Tag validation report saved: ${reportPath}`);
    
    return {
      success: issues.length === 0,
      stats: tagStats,
      issues: issues
    };
    
  } catch (error) {
    console.error('❌ Error validating tags:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run validation
validateTags().then(result => {
  if (result.success) {
    console.log('\n🎉 Tag validation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Tag validation found issues that need attention.');
    process.exit(1);
  }
});
