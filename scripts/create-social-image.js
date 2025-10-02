const fs = require('fs');
const path = require('path');

// This script creates a social media optimized image
// For now, we'll create a simple HTML file that can be converted to an image
// or we can use the existing logo and create a proper social media card

const createSocialImageHTML = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 630px;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #00ff00;
      padding: 40px;
    }
    .logo {
      width: 200px;
      height: 200px;
      margin-bottom: 30px;
      border: 3px solid #00ff00;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
    }
    .title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 0 0 10px #00ff00;
    }
    .subtitle {
      font-size: 24px;
      color: #00ff00;
      opacity: 0.8;
      margin-bottom: 20px;
    }
    .url {
      font-size: 18px;
      color: #00ff00;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">CW</div>
    <div class="title">CyberWorld Builders</div>
    <div class="subtitle">Software Engineering & Consulting Services</div>
    <div class="url">cyberworldbuilders.com</div>
  </div>
</body>
</html>`;

  const outputPath = path.join(process.cwd(), 'public', 'social-card.html');
  fs.writeFileSync(outputPath, html);
  console.log('✅ Created social card HTML template at:', outputPath);
  console.log('📝 You can open this in a browser and take a screenshot to create the social image');
  console.log('📝 Or use a tool like Puppeteer to convert it to PNG');
};

// For now, let's create a simple social media image using ImageMagick if available
const createSocialImageWithImageMagick = () => {
  const { execSync } = require('child_process');
  
  try {
    // Check if ImageMagick is available
    execSync('convert -version', { stdio: 'ignore' });
    
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    const outputPath = path.join(process.cwd(), 'public', 'images', 'social-card.png');
    
    // Create a 1200x630 social media card with black background
    const command = `convert -size 1200x630 xc:black "${logoPath}" -resize 200x200 -gravity center -composite -font Arial-Bold -pointsize 48 -fill "#00ff00" -gravity center -annotate +0+100 "CyberWorld Builders" -pointsize 24 -annotate +0+150 "Software Engineering & Consulting Services" -pointsize 18 -annotate +0+200 "cyberworldbuilders.com" "${outputPath}"`;
    
    execSync(command);
    console.log('✅ Created social media card with ImageMagick:', outputPath);
    
  } catch (error) {
    console.log('⚠️  ImageMagick not available, creating HTML template instead');
    createSocialImageHTML();
  }
};

// Main execution
console.log('🚀 Creating social media image...');
createSocialImageWithImageMagick();
