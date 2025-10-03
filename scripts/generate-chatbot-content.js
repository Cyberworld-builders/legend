#!/usr/bin/env node

/**
 * Generate Chatbot Content Cache
 * 
 * This script creates a content cache for the chatbot without requiring a vector database.
 * It extracts key information from blog posts and creates a searchable index.
 */

const fs = require('fs');
const path = require('path');

class ChatbotContentGenerator {
  constructor() {
    this.posts = [];
    this.contentCache = {
      topics: new Map(),
      tags: new Map(),
      keywords: new Map(),
      posts: [],
      generatedAt: new Date().toISOString()
    };
  }

  loadPosts() {
    try {
      const indexPath = path.join(process.cwd(), 'lib', 'post-index.json');
      const postIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      this.posts = postIndex.posts || [];
      console.log(`📚 Loaded ${this.posts.length} blog posts`);
    } catch (error) {
      console.error('Error loading posts:', error);
      this.posts = [];
    }
  }

  generateContentCache() {
    console.log('🔄 Generating chatbot content cache...');
    
    this.posts.forEach(post => {
      // Extract key information
      const postInfo = {
        slug: post.slug,
        title: post.title,
        description: post.description,
        publishedDate: post.publishedDate,
        topics: post.topics || [],
        tags: post.tags || [],
        keywords: post.keywords || [],
        isFeatured: post.isFeatured || false,
        category: post.category || 'General'
      };
      
      this.contentCache.posts.push(postInfo);
      
      // Index by topics
      if (post.topics) {
        post.topics.forEach(topic => {
          if (!this.contentCache.topics.has(topic)) {
            this.contentCache.topics.set(topic, []);
          }
          this.contentCache.topics.get(topic).push(postInfo);
        });
      }
      
      // Index by tags
      if (post.tags) {
        post.tags.forEach(tag => {
          if (!this.contentCache.tags.has(tag)) {
            this.contentCache.tags.set(tag, []);
          }
          this.contentCache.tags.get(tag).push(postInfo);
        });
      }
      
      // Index by keywords
      if (post.keywords) {
        post.keywords.forEach(keyword => {
          if (!this.contentCache.keywords.has(keyword)) {
            this.contentCache.keywords.set(keyword, []);
          }
          this.contentCache.keywords.get(keyword).push(postInfo);
        });
      }
    });
    
    console.log(`✅ Generated cache with ${this.contentCache.posts.length} posts`);
    console.log(`📊 Topics: ${this.contentCache.topics.size}`);
    console.log(`🏷️  Tags: ${this.contentCache.tags.size}`);
    console.log(`🔑 Keywords: ${this.contentCache.keywords.size}`);
  }

  saveContentCache() {
    const cachePath = path.join(process.cwd(), 'lib', 'chatbot-content-cache.json');
    
    // Convert Maps to Objects for JSON serialization
    const serializableCache = {
      ...this.contentCache,
      topics: Object.fromEntries(this.contentCache.topics),
      tags: Object.fromEntries(this.contentCache.tags),
      keywords: Object.fromEntries(this.contentCache.keywords)
    };
    
    fs.writeFileSync(cachePath, JSON.stringify(serializableCache, null, 2));
    console.log(`💾 Content cache saved: ${cachePath}`);
  }

  generateSearchIndex() {
    // Create a simple search index for fast lookups
    const searchIndex = {
      generatedAt: new Date().toISOString(),
      allTopics: Array.from(this.contentCache.topics.keys()),
      allTags: Array.from(this.contentCache.tags.keys()),
      allKeywords: Array.from(this.contentCache.keywords.keys()),
      featuredPosts: this.contentCache.posts.filter(p => p.isFeatured),
      recentPosts: this.contentCache.posts
        .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
        .slice(0, 5)
    };
    
    const indexPath = path.join(process.cwd(), 'lib', 'chatbot-search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
    console.log(`🔍 Search index saved: ${indexPath}`);
  }

  generateContentSummary() {
    // Create a summary of all content for the chatbot
    const summary = {
      generatedAt: new Date().toISOString(),
      totalPosts: this.contentCache.posts.length,
      topics: Array.from(this.contentCache.topics.keys()),
      popularTags: Array.from(this.contentCache.tags.keys())
        .sort((a, b) => this.contentCache.tags.get(b).length - this.contentCache.tags.get(a).length)
        .slice(0, 20),
      contentOverview: this.contentCache.posts.map(post => ({
        title: post.title,
        description: post.description,
        topics: post.topics,
        tags: post.tags.slice(0, 5) // Limit tags for summary
      }))
    };
    
    const summaryPath = path.join(process.cwd(), 'lib', 'chatbot-content-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📋 Content summary saved: ${summaryPath}`);
  }

  run() {
    console.log('🚀 Starting chatbot content generation...');
    
    this.loadPosts();
    this.generateContentCache();
    this.saveContentCache();
    this.generateSearchIndex();
    this.generateContentSummary();
    
    console.log('\n✅ Chatbot content generation complete!');
    console.log('📁 Generated files:');
    console.log('   - lib/chatbot-content-cache.json (full content cache)');
    console.log('   - lib/chatbot-search-index.json (search index)');
    console.log('   - lib/chatbot-content-summary.json (content summary)');
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new ChatbotContentGenerator();
  generator.run();
}

module.exports = { ChatbotContentGenerator };
