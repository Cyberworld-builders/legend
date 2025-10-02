const fs = require('fs');
const path = require('path');

// Simple script to resize a social media image to exact dimensions
// This uses a basic approach that should work with most images

const resizeSocialImage = () => {
  console.log('🖼️  Social Media Image Resizer');
  console.log('');
  console.log('📝 Instructions:');
  console.log('1. Take a screenshot of your social card HTML');
  console.log('2. Save it as "screenshot.png" in the public/images/ folder');
  console.log('3. Run this script to resize it to 1200x630');
  console.log('');
  
  const screenshotPath = path.join(process.cwd(), 'public', 'images', 'screenshot.png');
  const outputPath = path.join(process.cwd(), 'public', 'images', 'social-card.png');
  
  if (!fs.existsSync(screenshotPath)) {
    console.log('❌ Screenshot not found at:', screenshotPath);
    console.log('');
    console.log('📋 Please:');
    console.log('   1. Open public/social-card-direct.html in your browser');
    console.log('   2. Take a screenshot (any size is fine)');
    console.log('   3. Save it as public/images/screenshot.png');
    console.log('   4. Run this script again');
    return;
  }
  
  console.log('✅ Found screenshot at:', screenshotPath);
  console.log('📏 Will resize to 1200x630 for social media');
  console.log('');
  
  // For now, just copy the file and let the user know they can use online tools
  // In a production environment, you'd use sharp or similar for actual resizing
  console.log('🔄 Copying screenshot to social-card.png...');
  fs.copyFileSync(screenshotPath, outputPath);
  
  console.log('✅ Image copied to social-card.png');
  console.log('');
  console.log('📏 To resize to exact 1200x630 dimensions:');
  console.log('   Option 1: Use online tool like https://resizeimage.net/');
  console.log('   Option 2: Use image editor (Photoshop, GIMP, etc.)');
  console.log('   Option 3: Use command line tool like ImageMagick');
  console.log('');
  console.log('🎯 Target dimensions: 1200x630 pixels');
  console.log('📁 Output file: public/images/social-card.png');
};

// Alternative: Create a simple HTML page that can help with resizing
const createResizeHelper = () => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Card Resize Helper</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .preview {
      width: 400px;
      height: 210px;
      border: 2px dashed #ccc;
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9f9f9;
    }
    .target {
      width: 1200px;
      height: 630px;
      border: 2px solid #00ff00;
      margin: 20px 0;
      transform: scale(0.3);
      transform-origin: top left;
    }
    .instructions {
      background: #e8f5e8;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🖼️ Social Media Image Resize Helper</h1>
    
    <div class="instructions">
      <h3>📏 Target Dimensions: 1200x630 pixels</h3>
      <p>This is the exact size needed for social media previews.</p>
    </div>
    
    <div class="target" style="background: #000; color: #00ff00; display: flex; align-items: center; justify-content: center; font-family: monospace;">
      <div style="text-align: center;">
        <div style="width: 100px; height: 100px; border: 2px solid #00ff00; border-radius: 50%; margin: 0 auto 20px; background: #000;"></div>
        <div style="font-size: 24px; font-weight: bold;">CyberWorld Builders</div>
        <div style="font-size: 12px; opacity: 0.8;">Software Engineering & Consulting Services</div>
      </div>
    </div>
    
    <h3>📝 Instructions:</h3>
    <ol>
      <li>Take a screenshot of your social card HTML</li>
      <li>Save it as <code>public/images/screenshot.png</code></li>
      <li>Use an image editor to resize to exactly 1200x630</li>
      <li>Save as <code>public/images/social-card.png</code></li>
    </ol>
    
    <h3>🛠️ Online Tools:</h3>
    <ul>
      <li><a href="https://resizeimage.net/" target="_blank">ResizeImage.net</a></li>
      <li><a href="https://www.iloveimg.com/resize-image" target="_blank">ILoveIMG</a></li>
      <li><a href="https://www.canva.com/" target="_blank">Canva</a></li>
    </ul>
  </div>
</body>
</html>`;

  const helperPath = path.join(process.cwd(), 'public', 'resize-helper.html');
  fs.writeFileSync(helperPath, html);
  console.log('✅ Created resize helper at:', helperPath);
};

// Main execution
console.log('🚀 Social Media Image Resizer');
console.log('');
resizeSocialImage();
createResizeHelper();
