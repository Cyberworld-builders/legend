#!/usr/bin/env node

/**
 * Comprehensive SEO Maintenance Script
 * Automates the SEO maintenance tasks performed manually
 */

const fs = require('fs');
const path = require('path');
const { generatePostIndex } = require('./generate-post-index');

const POSTS_DIR = path.join(__dirname, '..', 'app', 'blog', 'posts', 'markdown');
const INDEX_FILE = path.join(__dirname, '..', 'lib', 'post-index.json');
const CONTENT_UTILS_FILE = path.join(__dirname, '..', 'lib', 'content-utils.ts');
const AUTHOR_SCHEMA_FILE = path.join(__dirname, '..', 'components', 'AuthorSchema.tsx');

// SEO Maintenance Tasks
class SEOMaintenance {
  constructor() {
    this.posts = [];
    this.stats = {
      postsProcessed: 0,
      topicsUpdated: 0,
      internalLinksAdded: 0,
      schemaValidated: 0,
      issuesFound: 0
    };
  }

  async run() {
    console.log('🚀 Starting Comprehensive SEO Maintenance...\n');
    
    try {
      // 1. Generate/Update Post Index
      await this.updatePostIndex();
      
      // 2. Validate Post Metadata
      await this.validatePostMetadata();
      
      // 3. Check Topic Clusters
      await this.validateTopicClusters();
      
      // 4. Validate Internal Linking
      await this.validateInternalLinking();
      
      // 5. Check Schema Markup
      await this.validateSchemaMarkup();
      
      // 6. Validate Tag Pages
      await this.validateTagPages();
      
      // 7. Generate SEO Report
      await this.generateSEOReport();
      
      console.log('\n✅ SEO Maintenance Complete!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ SEO Maintenance failed:', error.message);
      process.exit(1);
    }
  }

  async updatePostIndex() {
    console.log('📝 Step 1: Updating Post Index...');
    await generatePostIndex();
    console.log('   ✅ Post index updated');
  }

  async validatePostMetadata() {
    console.log('🔍 Step 2: Validating Post Metadata...');
    
    if (!fs.existsSync(INDEX_FILE)) {
      console.log('   ⚠️  Post index not found, skipping metadata validation');
      return;
    }

    const indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
    const postIndex = JSON.parse(indexContent);
    this.posts = postIndex.posts || [];

    let issues = 0;
    const requiredFields = ['title', 'publishedDate', 'modifiedDate', 'keywords', 'topics', 'tags'];
    
    for (const post of this.posts) {
      for (const field of requiredFields) {
        if (!post[field] || (Array.isArray(post[field]) && post[field].length === 0)) {
          console.log(`   ⚠️  ${post.slug}: Missing or empty ${field}`);
          issues++;
        }
      }
      
      // Check for posts older than 90 days that might need review
      const publishedDate = new Date(post.publishedDate);
      const daysSincePublished = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSincePublished > 90) {
        console.log(`   📅 ${post.slug}: Published ${Math.floor(daysSincePublished)} days ago - consider review`);
      }
    }

    this.stats.postsProcessed = this.posts.length;
    this.stats.issuesFound += issues;
    console.log(`   ✅ Validated ${this.posts.length} posts, found ${issues} issues`);
  }

  async validateTopicClusters() {
    console.log('🏷️  Step 3: Validating Topic Clusters...');
    
    if (!fs.existsSync(CONTENT_UTILS_FILE)) {
      console.log('   ⚠️  Content utils file not found');
      return;
    }

    const contentUtils = fs.readFileSync(CONTENT_UTILS_FILE, 'utf8');
    
    // Check if all posts are categorized
    const topicCategories = ['AI & Automation', 'Career & Professional Development', 'Development & Tools', 'Marketing & Business'];
    let uncategorizedPosts = 0;
    
    for (const post of this.posts) {
      if (!post.topics || post.topics.length === 0) {
        console.log(`   ⚠️  ${post.slug}: No topics assigned`);
        uncategorizedPosts++;
      }
    }

    this.stats.topicsUpdated = this.posts.length - uncategorizedPosts;
    console.log(`   ✅ Topic clusters validated, ${uncategorizedPosts} posts need categorization`);
  }

  async validateInternalLinking() {
    console.log('🔗 Step 4: Validating Internal Linking...');
    
    if (!fs.existsSync(CONTENT_UTILS_FILE)) {
      console.log('   ⚠️  Content utils file not found');
      return;
    }

    const contentUtils = fs.readFileSync(CONTENT_UTILS_FILE, 'utf8');
    
    // Check if post references are up to date
    const postReferences = this.extractPostReferences(contentUtils);
    const currentPostSlugs = this.posts.map(p => p.slug);
    const missingReferences = currentPostSlugs.filter(slug => 
      !postReferences.some(ref => ref.slug === slug)
    );

    if (missingReferences.length > 0) {
      console.log(`   ⚠️  Missing internal linking for: ${missingReferences.join(', ')}`);
    }

    this.stats.internalLinksAdded = postReferences.length;
    console.log(`   ✅ Internal linking validated, ${postReferences.length} posts have linking keywords`);
  }

  async validateSchemaMarkup() {
    console.log('📋 Step 5: Validating Schema Markup...');
    
    // Check if AuthorSchema exists and has recent updates
    if (fs.existsSync(AUTHOR_SCHEMA_FILE)) {
      const authorSchema = fs.readFileSync(AUTHOR_SCHEMA_FILE, 'utf8');
      
      // Check for key schema elements
      const hasKnowsAbout = authorSchema.includes('knowsAbout');
      const hasSameAs = authorSchema.includes('sameAs');
      const hasJobTitle = authorSchema.includes('jobTitle');
      
      if (hasKnowsAbout && hasSameAs && hasJobTitle) {
        console.log('   ✅ Author schema markup is complete');
        this.stats.schemaValidated = 1;
      } else {
        console.log('   ⚠️  Author schema missing key elements');
      }
    } else {
      console.log('   ⚠️  AuthorSchema.tsx not found');
    }
  }

  async validateTagPages() {
    console.log('🏷️  Step 6: Validating Tag Pages...');
    
    try {
      // Run tag validation script
      const { execSync } = require('child_process');
      execSync('node scripts/validate-tags.js', { stdio: 'pipe' });
      console.log('   ✅ Tag validation completed');
      
      // Run tag page generation script
      execSync('node scripts/generate-tag-pages.js', { stdio: 'pipe' });
      console.log('   ✅ Tag page generation completed');
      
    } catch (error) {
      console.log('   ⚠️  Tag validation/generation failed:', error.message);
      this.stats.issuesFound++;
    }
  }

  async generateSEOReport() {
    console.log('📊 Step 6: Generating SEO Report...');
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalPosts: this.posts.length,
        publishedPosts: this.posts.filter(p => !p.isDraft).length,
        draftPosts: this.posts.filter(p => p.isDraft).length,
        featuredPosts: this.posts.filter(p => p.isFeatured).length,
        postsNeedingReview: this.posts.filter(p => {
          const daysSincePublished = (Date.now() - new Date(p.publishedDate).getTime()) / (1000 * 60 * 60 * 24);
          return daysSincePublished > 90;
        }).length
      },
      topics: this.getTopicDistribution(),
      recommendations: this.generateRecommendations()
    };

    const reportFile = path.join(__dirname, '..', 'seo-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`   ✅ SEO report generated: ${reportFile}`);
  }

  getTopicDistribution() {
    const topicCounts = {};
    for (const post of this.posts) {
      if (post.topics) {
        for (const topic of post.topics) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      }
    }
    return topicCounts;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.stats.issuesFound > 0) {
      recommendations.push(`Fix ${this.stats.issuesFound} metadata issues found`);
    }
    
    const postsNeedingReview = this.posts.filter(p => {
      const daysSincePublished = (Date.now() - new Date(p.publishedDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSincePublished > 90;
    }).length;
    
    if (postsNeedingReview > 0) {
      recommendations.push(`Review ${postsNeedingReview} posts older than 90 days`);
    }
    
    const uncategorizedPosts = this.posts.filter(p => !p.topics || p.topics.length === 0).length;
    if (uncategorizedPosts > 0) {
      recommendations.push(`Categorize ${uncategorizedPosts} posts with topics`);
    }
    
    return recommendations;
  }

  extractPostReferences(content) {
    // Simple extraction of post references from content-utils.ts
    const references = [];
    const lines = content.split('\n');
    let currentRef = null;
    
    for (const line of lines) {
      if (line.includes('slug:')) {
        const slugMatch = line.match(/slug:\s*['"`]([^'"`]+)['"`]/);
        if (slugMatch) {
          currentRef = { slug: slugMatch[1], keywords: [] };
        }
      } else if (currentRef && line.includes('keywords:')) {
        const keywordsMatch = line.match(/keywords:\s*\[(.*?)\]/);
        if (keywordsMatch) {
          currentRef.keywords = keywordsMatch[1].split(',').map(k => k.trim().replace(/['"]/g, ''));
          references.push(currentRef);
          currentRef = null;
        }
      }
    }
    
    return references;
  }

  printSummary() {
    console.log('\n📈 SEO Maintenance Summary:');
    console.log(`   📝 Posts Processed: ${this.stats.postsProcessed}`);
    console.log(`   🏷️  Topics Updated: ${this.stats.topicsUpdated}`);
    console.log(`   🔗 Internal Links: ${this.stats.internalLinksAdded}`);
    console.log(`   📋 Schema Validated: ${this.stats.schemaValidated}`);
    console.log(`   ⚠️  Issues Found: ${this.stats.issuesFound}`);
  }
}

// Run if called directly
if (require.main === module) {
  const seoMaintenance = new SEOMaintenance();
  seoMaintenance.run();
}

module.exports = { SEOMaintenance };


