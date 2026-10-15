#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

// Generate a concise alt text from the post title
function generateAltText(title) {
  // Create a descriptive alt text based on the title
  // Format: "Featured image for [title topic]"
  const cleanTitle = title.replace(/['"]/g, '');
  return `Featured image for article: ${cleanTitle}`;
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));

let updated = 0;
let skipped = 0;

for (const file of files) {
  const filepath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Check if socialImageAlt already exists
  if (content.includes('socialImageAlt:')) {
    skipped++;
    continue;
  }
  
  // Extract title from frontmatter
  const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (!titleMatch) {
    console.error(`Could not find title in ${file}`);
    continue;
  }
  
  const title = titleMatch[1].replace(/^["']|["']$/g, '');
  const altText = generateAltText(title);
  
  // Find the socialImage line and add socialImageAlt after it
  if (content.includes('socialImage:')) {
    const newContent = content.replace(
      /^(socialImage:\s*.+)$/m,
      `$1\nsocialImageAlt: "${altText}"`
    );
    
    if (newContent !== content) {
      fs.writeFileSync(filepath, newContent);
      updated++;
      console.log(`Updated: ${file}`);
    }
  } else {
    // If no socialImage, add after headerImage
    const newContent = content.replace(
      /^(headerImage:\s*.+)$/m,
      `$1\nsocialImageAlt: "${altText}"`
    );
    
    if (newContent !== content) {
      fs.writeFileSync(filepath, newContent);
      updated++;
      console.log(`Updated: ${file}`);
    }
  }
}

console.log(`\nDone: Updated ${updated} files, skipped ${skipped} (already had socialImageAlt)`);
