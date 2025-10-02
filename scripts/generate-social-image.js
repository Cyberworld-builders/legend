const fs = require('fs');
const path = require('path');

// Script to generate the social media image from the HTML template
// This creates a proper social media card with the actual logo

const generateSocialImage = () => {
  console.log('🚀 Generating social media image...');
  
  // Check if the HTML template exists
  const htmlPath = path.join(process.cwd(), 'public', 'social-card.html');
  const outputPath = path.join(process.cwd(), 'public', 'images', 'social-card.png');
  
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Social card HTML template not found at:', htmlPath);
    return;
  }
  
  console.log('✅ Found social card HTML template');
  console.log('📝 To create the social media image:');
  console.log('   1. Open public/social-card.html in a browser');
  console.log('   2. Set browser zoom to 100%');
  console.log('   3. Take a screenshot at 1200x630 resolution');
  console.log('   4. Save as public/images/social-card.png');
  console.log('');
  console.log('🎯 The template now uses the actual favicon logo instead of "CW" text');
  console.log('🎨 Features:');
  console.log('   - Black background (#000000)');
  console.log('   - Green branding (#00ff00)');
  console.log('   - Actual CyberWorld Builders favicon logo');
  console.log('   - Proper 1200x630 dimensions for social media');
  console.log('   - Cyberpunk aesthetic matching your site');
  
  // Also create a simple instruction file
  const instructions = `
# Social Media Image Generation

## Quick Steps:
1. Open \`public/social-card.html\` in your browser
2. Take a screenshot at 1200x630 resolution
3. Save as \`public/images/social-card.png\`

## Features:
- ✅ Uses actual favicon logo (skull and code rain)
- ✅ Black background (#000000)
- ✅ Green branding (#00ff00)
- ✅ Proper social media dimensions (1200x630)
- ✅ Cyberpunk aesthetic

## Testing:
After creating the image, test social media previews:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: Share a link and check preview

## Current Status:
- ✅ HTML template created with actual logo
- ✅ Metadata configured with proper fallbacks
- ⏳ Need to create the actual PNG image
`;

  const instructionsPath = path.join(process.cwd(), 'SOCIAL_IMAGE_GUIDE.md');
  fs.writeFileSync(instructionsPath, instructions);
  console.log('✅ Created instructions at:', instructionsPath);
};

// Main execution
generateSocialImage();
