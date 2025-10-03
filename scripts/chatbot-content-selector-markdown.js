#!/usr/bin/env node

/**
 * Chatbot Content Selector - Markdown Version
 * 
 * This script reads markdown files directly for better content analysis
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class MarkdownContentSelector {
  constructor() {
    this.posts = [];
    this.markdownDir = path.join(process.cwd(), 'app', 'blog', 'posts', 'markdown');
    this.loadMarkdownPosts();
  }

  loadMarkdownPosts() {
    try {
      const files = fs.readdirSync(this.markdownDir).filter(file => file.endsWith('.md'));
      console.log(`📚 Found ${files.length} markdown files`);
      
      this.posts = files.map(filename => {
        const filePath = path.join(this.markdownDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);
        
        return {
          filename,
          slug: filename.replace('.md', ''),
          frontmatter,
          content,
          title: frontmatter.title || '',
          description: frontmatter.description || '',
          tags: frontmatter.tags || [],
          keywords: frontmatter.keywords || [],
          topics: frontmatter.topics || []
        };
      });
      
      console.log(`✅ Loaded ${this.posts.length} markdown posts with full content`);
    } catch (error) {
      console.error('Error loading markdown posts:', error);
      this.posts = [];
    }
  }

  // Enhanced content selection with full text analysis
  selectRelevantContent(userQuery, maxPosts = 3) {
    const queryLower = userQuery.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Score posts based on relevance
    const scoredPosts = this.posts.map(post => {
      let score = 0;
      
      // Check title relevance (highest weight)
      const title = (post.title || '').toLowerCase();
      queryWords.forEach(word => {
        if (title.includes(word)) score += 5;
      });
      
      // Check description relevance
      const description = (post.description || '').toLowerCase();
      queryWords.forEach(word => {
        if (description.includes(word)) score += 3;
      });
      
      // Check content relevance (NEW - this is the key advantage!)
      const content = (post.content || '').toLowerCase();
      queryWords.forEach(word => {
        const wordCount = (content.match(new RegExp(word, 'g')) || []).length;
        score += wordCount * 2; // Weight by frequency
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
      summary += `   Topics: ${post.topics.join(', ') || 'N/A'}\n`;
      summary += `   Tags: ${post.tags.join(', ') || 'N/A'}\n`;
      
      // Include a snippet of the actual content (first 200 chars)
      const contentSnippet = post.content.substring(0, 200).replace(/\n/g, ' ').trim();
      summary += `   Content snippet: "${contentSnippet}..."\n`;
      summary += `   URL: /blog/${post.slug}\n\n`;
    });
    
    summary += 'You can reference these articles and their content when providing answers.';
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

module.exports = { MarkdownContentSelector };

// Test the content selector
if (require.main === module) {
  const selector = new MarkdownContentSelector();
  
  console.log('🧪 Testing markdown content selector...');
  
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
      console.log(`      Score: ${post.score || 'N/A'}`);
    });
  });
  
  console.log('\n📊 Available topics:', selector.getAllTopics());
  console.log('🏷️  Available tags:', selector.getAllTags().slice(0, 10), '...');
}
