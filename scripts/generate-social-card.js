const fs = require('fs');
const path = require('path');

// Create a simple social media card using CSS and HTML that can be converted to image
const createSocialCard = () => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberWorld Builders - Social Card</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', 'Monaco', monospace;
      overflow: hidden;
    }
    
    .card {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
    }
    
    .logo-container {
      width: 200px;
      height: 200px;
      border: 4px solid #00ff00;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }
    
    .logo-text {
      font-size: 48px;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
    }
    
    .title {
      font-size: 56px;
      font-weight: bold;
      color: #00ff00;
      margin-bottom: 20px;
      text-shadow: 0 0 15px #00ff00;
      letter-spacing: 2px;
    }
    
    .subtitle {
      font-size: 28px;
      color: #00ff00;
      opacity: 0.9;
      margin-bottom: 30px;
      font-weight: 300;
    }
    
    .url {
      font-size: 20px;
      color: #00ff00;
      opacity: 0.7;
      font-weight: 300;
    }
    
    .grid-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.1;
      background-image: 
        linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
    }
    
    .corner-accent {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 2px solid #00ff00;
      opacity: 0.3;
    }
    
    .corner-accent.top-left {
      top: 20px;
      left: 20px;
      border-right: none;
      border-bottom: none;
    }
    
    .corner-accent.bottom-right {
      bottom: 20px;
      right: 20px;
      border-left: none;
      border-top: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="grid-pattern"></div>
    <div class="corner-accent top-left"></div>
    <div class="corner-accent bottom-right"></div>
    
    <div class="logo-container">
      <div class="logo-text">CW</div>
    </div>
    
    <div class="title">CyberWorld Builders</div>
    <div class="subtitle">Software Engineering & Consulting Services</div>
    <div class="url">cyberworldbuilders.com</div>
  </div>
</body>
</html>`;

  const outputPath = path.join(process.cwd(), 'public', 'social-card.html');
  fs.writeFileSync(outputPath, html);
  console.log('✅ Created social card HTML at:', outputPath);
  
  // Also create a simple fallback using the existing logo
  createFallbackSocialImage();
};

const createFallbackSocialImage = () => {
  // Create a simple text file that describes how to create the social image
  const instructions = `
# Social Media Image Creation Instructions

## Option 1: Using the HTML Template
1. Open public/social-card.html in a browser
2. Take a screenshot at 1200x630 resolution
3. Save as public/images/social-card.png

## Option 2: Using Online Tools
1. Use tools like Canva, Figma, or similar
2. Create a 1200x630 image with:
   - Black background (#000000)
   - Green text (#00ff00)
   - "CyberWorld Builders" as main title
   - "Software Engineering & Consulting Services" as subtitle
   - "cyberworldbuilders.com" as URL
3. Save as public/images/social-card.png

## Option 3: Using the Existing Logo
The current setup uses public/images/logo.png as the fallback social image.
This works but may not be optimized for social media previews.

## Current Social Image URLs:
- Default: https://cyberworldbuilders.com/images/logo.png
- Custom: https://cyberworldbuilders.com/images/social-card.png (when created)
`;

  const instructionsPath = path.join(process.cwd(), 'SOCIAL_IMAGE_INSTRUCTIONS.md');
  fs.writeFileSync(instructionsPath, instructions);
  console.log('✅ Created instructions at:', instructionsPath);
};

// Main execution
console.log('🚀 Generating social media card...');
createSocialCard();
console.log('📝 Next steps:');
console.log('   1. Open public/social-card.html in a browser');
console.log('   2. Take a screenshot at 1200x630 resolution');
console.log('   3. Save as public/images/social-card.png');
console.log('   4. Update the social image URLs in the code');
