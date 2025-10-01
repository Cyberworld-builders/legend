#!/usr/bin/env node

/**
 * Generate a static index of blog posts for serverless deployments
 * This script scans the markdown directory and creates a JSON index file
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'app', 'blog', 'posts', 'markdown');
const INDEX_FILE = path.join(__dirname, '..', 'lib', 'post-index.json');

// Simple YAML frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content };
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  // Simple YAML parser for basic key-value pairs and arrays
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = '';
  let currentArray = [];
  let inArray = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Check if this is an array item (starts with -)
    if (trimmed.startsWith('- ')) {
      if (!inArray) {
        // Start of a new array
        inArray = true;
        currentArray = [];
      }
      const arrayValue = trimmed.substring(2).trim();
      // Remove quotes if present
      const cleanValue = (arrayValue.startsWith('"') && arrayValue.endsWith('"')) || 
                        (arrayValue.startsWith("'") && arrayValue.endsWith("'"))
                        ? arrayValue.slice(1, -1) : arrayValue;
      currentArray.push(cleanValue);
      continue;
    }
    
    // If we were in an array and this line doesn't start with -, save the array
    if (inArray) {
      frontmatter[currentKey] = currentArray;
      inArray = false;
      currentArray = [];
    }
    
    // Check if this is a key-value pair
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // If value is empty, it might be the start of an array
    if (!value) {
      currentKey = key;
      // Check if next line starts with -
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        inArray = true;
        currentArray = [];
        continue;
      }
    }
    
    // Parse arrays (comma-separated)
    if (value.includes(',')) {
      frontmatter[key] = value.split(',').map(v => v.trim());
    }
    // Parse booleans
    else if (value.toLowerCase() === 'true') {
      frontmatter[key] = true;
    }
    else if (value.toLowerCase() === 'false') {
      frontmatter[key] = false;
    }
    // Parse numbers
    else if (!isNaN(Number(value)) && value !== '') {
      frontmatter[key] = Number(value);
    }
    // Parse dates
    else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      frontmatter[key] = new Date(value);
    }
    // Default to string
    else if (value) {
      frontmatter[key] = value;
    }
  }
  
  // Handle case where file ends with an array
  if (inArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }
  
  return { frontmatter, content: markdownContent };
}

function generatePostIndex() {
  try {
    console.log('🚀 Starting post index generation...');
    console.log('📁 Posts directory:', POSTS_DIR);
    console.log('📄 Index file path:', INDEX_FILE);
    console.log('🔍 Current working directory:', process.cwd());
    console.log('🔍 __dirname:', __dirname);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('Scanning for blog posts...');
    
    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      console.warn(`Posts directory not found: ${POSTS_DIR}`);
      console.log('Creating fallback index with known posts...');
      
      // Create fallback index with known posts
      const fallbackPosts = [
        'building-an-effective-web-presence-for-professional-validation',
        'building-drum-note-ai-powered-drum-transcription-kit-generation-and-hands-on-marketing-with-rendercom',
        'early-adventures-in-freelance-web-development-lessons-from-the-wordpress-era',
        'enhancing-seo-on-my-company-landing-site-with-ai-agents',
        'intro-to-linux-how-i-stayed-in-the-dev-game-while-too-broke-to-buy-a-pc',
        'my-first-steps-into-coding',
        'my-first-tech-job-the-evolution-of-the-docworks-emr-system-2011-2013',
        'replit-test-drive',
        'revenant-hollow-integrating-technology-into-location-based-horror-experiences',
        'scaling-novelty-with-an-agentic-blog-bot',
        'the-jumpstarter-a-5-point-framework-to-align-value-and-passion',
        'the-last-cycle-why-founder-engineer-partnerships-are-nearing-their-end',
        'transitioning-from-cable-contracting-to-freelance-web-development-a-career-pivot',
        'troubleshooting-n8n-workflows-integrated-with-supabase-vapi-and-lovable-for-ai-driven-sales-automation'
      ];
      
      const fallbackIndex = {
        generatedAt: new Date().toISOString(),
        count: fallbackPosts.length,
        posts: fallbackPosts.map(slug => ({
          slug,
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          publishedDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          lastReviewedDate: new Date().toISOString(),
          isDraft: false,
          isFeatured: false,
          priority: 5,
          category: '',
          series: '',
          topics: [],
          tags: [],
          keywords: [],
          wordCount: 0,
          fileSize: 0,
          fileModified: new Date().toISOString()
        }))
      };
      
      fs.writeFileSync(INDEX_FILE, JSON.stringify(fallbackIndex, null, 2));
      console.log(`✅ Generated fallback post index: ${INDEX_FILE}`);
      return fallbackIndex;
    }
    
    // Read all markdown files
    const files = fs.readdirSync(POSTS_DIR);
    const markdownFiles = files.filter(file => 
      file.endsWith('.md') && 
      !file.startsWith('.') &&
      !file.includes('frontmatter-example') && // Exclude example files
      !file.includes('example-with-frontmatter') // Exclude example files
    );
    
    console.log(`Found ${markdownFiles.length} blog posts, extracting metadata...`);
    
    // Process each file to extract metadata
    const posts = [];
    
    for (const file of markdownFiles) {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(POSTS_DIR, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        const { frontmatter } = parseFrontmatter(content);
        
        // Extract title from content if not in frontmatter
        let title = frontmatter.title;
        if (!title) {
          const titleMatch = content.match(/^#\s+(.+)$/m);
          title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        // Create post metadata object
        const postMeta = {
          slug,
          title,
          publishedDate: frontmatter.publishedDate || frontmatter.published || stats.ctime.toISOString(),
          modifiedDate: frontmatter.modifiedDate || frontmatter.modified || stats.mtime.toISOString(),
          lastReviewedDate: frontmatter.lastReviewedDate || frontmatter.lastReviewed || stats.mtime.toISOString(),
          isDraft: frontmatter.isDraft || frontmatter.draft || false,
          isFeatured: frontmatter.isFeatured || frontmatter.featured || false,
          priority: frontmatter.priority || 5,
          category: frontmatter.category || '',
          series: frontmatter.series || '',
          topics: frontmatter.topics || [],
          tags: frontmatter.tags || [],
          keywords: frontmatter.keywords || [],
          wordCount: content.split(/\s+/).length,
          fileSize: stats.size,
          fileModified: stats.mtime.toISOString()
        };
        
        posts.push(postMeta);
        console.log(`  ✓ ${slug} - ${title}`);
        
      } catch (error) {
        console.warn(`  ⚠️  Error processing ${slug}:`, error.message);
        // Add basic entry even if parsing fails
        posts.push({
          slug,
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          publishedDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          lastReviewedDate: new Date().toISOString(),
          isDraft: false,
          isFeatured: false,
          priority: 5,
          category: '',
          series: '',
          topics: [],
          tags: [],
          keywords: [],
          wordCount: 0,
          fileSize: 0,
          fileModified: new Date().toISOString()
        });
      }
    }
    
    // Sort posts by published date (most recent first)
    posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    
    // Create index object
    const postIndex = {
      generatedAt: new Date().toISOString(),
      count: posts.length,
      posts: posts
    };
    
    // Write index file
    fs.writeFileSync(INDEX_FILE, JSON.stringify(postIndex, null, 2));
    
    console.log(`\n✅ Generated post index: ${INDEX_FILE}`);
    console.log(`📊 Index contains ${posts.length} posts with metadata`);
    
    // Verify the file was created
    if (fs.existsSync(INDEX_FILE)) {
      const stats = fs.statSync(INDEX_FILE);
      console.log(`✅ File verification: ${INDEX_FILE} exists (${stats.size} bytes)`);
    } else {
      console.error(`❌ File verification failed: ${INDEX_FILE} does not exist`);
    }
    
    // Show summary
    const publishedPosts = posts.filter(p => !p.isDraft);
    const draftPosts = posts.filter(p => p.isDraft);
    const featuredPosts = posts.filter(p => p.isFeatured);
    
    console.log(`📈 Summary:`);
    console.log(`   - Published: ${publishedPosts.length}`);
    console.log(`   - Drafts: ${draftPosts.length}`);
    console.log(`   - Featured: ${featuredPosts.length}`);
    
    return postIndex;
    
  } catch (error) {
    console.error('❌ Error generating post index:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generatePostIndex();
}

module.exports = { generatePostIndex };
