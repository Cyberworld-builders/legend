const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Normalizes tag strings by replacing spaces with hyphens
 * @param {string} tag - The tag to normalize
 * @returns {string} - Normalized tag
 */
function normalizeTag(tag) {
  return tag.replace(/\s+/g, '-');
}

/**
 * Process a single markdown file and normalize its tags/keywords
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - Result object with changes
 */
function processMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);
  
  let hasChanges = false;
  const changes = {
    file: path.basename(filePath),
    tags: { before: [], after: [] },
    keywords: { before: [], after: [] }
  };
  
  // Normalize tags
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    changes.tags.before = [...frontmatter.tags];
    frontmatter.tags = frontmatter.tags.map(tag => normalizeTag(tag));
    changes.tags.after = [...frontmatter.tags];
    
    if (JSON.stringify(changes.tags.before) !== JSON.stringify(changes.tags.after)) {
      hasChanges = true;
    }
  }
  
  // Normalize keywords
  if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) {
    changes.keywords.before = [...frontmatter.keywords];
    frontmatter.keywords = frontmatter.keywords.map(keyword => normalizeTag(keyword));
    changes.keywords.after = [...frontmatter.keywords];
    
    if (JSON.stringify(changes.keywords.before) !== JSON.stringify(changes.keywords.after)) {
      hasChanges = true;
    }
  }
  
  // Write back to file if changes were made
  if (hasChanges) {
    const newContent = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
  
  return { hasChanges, changes };
}

/**
 * Main function to process all markdown files
 */
function main() {
  console.log('🏷️  Starting tag normalization...\n');
  
  const markdownDir = path.join(process.cwd(), 'app', 'blog', 'posts', 'markdown');
  const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));
  
  console.log(`📁 Found ${files.length} markdown files\n`);
  
  let totalChanges = 0;
  const changedFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(markdownDir, file);
    const result = processMarkdownFile(filePath);
    
    if (result.hasChanges) {
      totalChanges++;
      changedFiles.push(result.changes);
      
      console.log(`✏️  ${file}`);
      
      // Show tags changes
      if (result.changes.tags.before.length > 0 || result.changes.tags.after.length > 0) {
        const tagsChanged = JSON.stringify(result.changes.tags.before) !== JSON.stringify(result.changes.tags.after);
        if (tagsChanged) {
          console.log(`   Tags:`);
          result.changes.tags.before.forEach((tag, idx) => {
            if (tag !== result.changes.tags.after[idx]) {
              console.log(`     - "${tag}" → "${result.changes.tags.after[idx]}"`);
            }
          });
        }
      }
      
      // Show keywords changes
      if (result.changes.keywords.before.length > 0 || result.changes.keywords.after.length > 0) {
        const keywordsChanged = JSON.stringify(result.changes.keywords.before) !== JSON.stringify(result.changes.keywords.after);
        if (keywordsChanged) {
          console.log(`   Keywords:`);
          result.changes.keywords.before.forEach((keyword, idx) => {
            if (keyword !== result.changes.keywords.after[idx]) {
              console.log(`     - "${keyword}" → "${result.changes.keywords.after[idx]}"`);
            }
          });
        }
      }
      
      console.log('');
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Files changed: ${totalChanges}`);
  console.log(`   Files unchanged: ${files.length - totalChanges}`);
  
  if (totalChanges > 0) {
    console.log('\n✅ Tag normalization completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run seo');
    console.log('   2. Run: npm run build');
    console.log('   3. Commit the changes');
  } else {
    console.log('\n✅ All tags are already normalized!');
  }
}

// Run the script
main();

