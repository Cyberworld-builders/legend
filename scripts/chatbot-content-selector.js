#!/usr/bin/env node

/**
 * Chatbot Content Selector
 * 
 * This script helps select the most relevant blog content for chatbot responses
 * without requiring a vector database.
 */

const fs = require('fs');
const path = require('path');

class ContentSelector {
  constructor() {
    this.posts = [];
    this.loadPosts();
  }

  loadPosts() {
    try {
      const indexPath = path.join(process.cwd(), 'lib', 'post-index.json');
      const postIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      this.posts = postIndex.posts || [];
      console.log(`📚 Loaded ${this.posts.length} blog posts for content selection`);
    } catch (error) {
      console.error('Error loading posts:', error);
      this.posts = [];
    }
  }

  // Simple keyword-based content selection
  selectRelevantContent(userQuery, maxPosts = 3) {
    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Score posts based on relevance
    const scoredPosts = this.posts.map(post => {
      let score = 0;
      
      // Check title relevance
      const title = (post.title || '').toString().toLowerCase();
      queryWords.forEach(word => {
        if (title.includes(word)) score += 3;
      });
      
      // Check description relevance
      const description = (post.description || '').toString().toLowerCase();
      queryWords.forEach(word => {
        if (description.includes(word)) score += 2;
      });
      
      // Check tags relevance
      const tags = (post.tags || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (tags.includes(word)) score += 2;
      });
      
      // Check keywords relevance
      const keywords = (post.keywords || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (keywords.includes(word)) score += 1;
      });
      
      // Check topics relevance
      const topics = (post.topics || []).join(' ').toLowerCase();
      queryWords.forEach(word => {
        if (topics.includes(word)) score += 1;
      });
      
      return { post, score };
    });
    
    // Sort by score and return top posts
    return scoredPosts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts)
      .map(item => item.post);
  }

  // Get content summary for chatbot context
  getContentSummary(relevantPosts) {
    if (relevantPosts.length === 0) return '';
    
    let summary = '\n\nRelevant blog content that might help answer this question:\n';
    
    relevantPosts.forEach((post, index) => {
      summary += `${index + 1}. "${post.title}"\n`;
      summary += `   Description: ${post.description}\n`;
      summary += `   Topics: ${post.topics?.join(', ') || 'N/A'}\n`;
      summary += `   Tags: ${post.tags?.join(', ') || 'N/A'}\n`;
      summary += `   URL: /blog/${post.slug}\n\n`;
    });
    
    summary += 'You can reference these articles when providing answers.';
    return summary;
  }

  // Get all available topics for context
  getAllTopics() {
    const topics = new Set();
    this.posts.forEach(post => {
      if (post.topics) {
        post.topics.forEach(topic => topics.add(topic));
      }
    });
    return Array.from(topics);
  }

  // Get all available tags for context
  getAllTags() {
    const tags = new Set();
    this.posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }
}

module.exports = { ContentSelector };

// Test the content selector
if (require.main === module) {
  const selector = new ContentSelector();
  
  console.log('🧪 Testing content selector...');
  
  // Test queries
  const testQueries = [
    'How do I transition from cable contracting to software development?',
    'What are the best AI tools for coding?',
    'How do I build a blog with Next.js?',
    'What is n8n and how do I use it?',
    'How do I optimize SEO for my website?'
  ];
  
  testQueries.forEach(query => {
    console.log(`\n🔍 Query: "${query}"`);
    const relevant = selector.selectRelevantContent(query, 2);
    console.log(`📄 Found ${relevant.length} relevant posts:`);
    relevant.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
    });
  });
  
  console.log('\n📊 Available topics:', selector.getAllTopics());
  console.log('🏷️  Available tags:', selector.getAllTags().slice(0, 10), '...');
}
