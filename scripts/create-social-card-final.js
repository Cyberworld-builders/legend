const fs = require('fs');
const path = require('path');

// Create a proper social media card with black background
const createSocialCard = () => {
  // Create a simple HTML file that can be converted to an image
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberWorld Builders Social Card</title>
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
      background: #000000;
      position: relative;
    }
    
    .logo {
      width: 120px;
      height: 120px;
      border: 3px solid #00ff00;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 25px;
      font-size: 28px;
      font-weight: bold;
      color: #00ff00;
      text-shadow: 0 0 8px #00ff00;
    }
    
    .title {
      font-size: 36px;
      font-weight: bold;
      color: #00ff00;
      margin-bottom: 12px;
      text-shadow: 0 0 8px #00ff00;
    }
    
    .subtitle {
      font-size: 18px;
      color: #00ff00;
      opacity: 0.9;
      margin-bottom: 15px;
    }
    
    .url {
      font-size: 14px;
      color: #00ff00;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">CW</div>
    <div class="title">CyberWorld Builders</div>
    <div class="subtitle">Software Engineering & Consulting Services</div>
    <div class="url">cyberworldbuilders.com</div>
  </div>
</body>
</html>`;

  const outputPath = path.join(process.cwd(), 'public', 'social-card.html');
  fs.writeFileSync(outputPath, html);
  
  console.log('✅ Created social card HTML template');
  console.log('📝 To create the proper social image:');
  console.log('   1. Open public/social-card.html in a browser');
  console.log('   2. Take a screenshot at 1200x630 resolution');
  console.log('   3. Save as public/images/social-card.png');
  
  return outputPath;
};

// Create a simple black background image as fallback
const createBlackBackgroundImage = () => {
  // Create a simple 1x1 black pixel and save it as a base64 encoded PNG
  const blackPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const blackPixelPath = path.join(process.cwd(), 'public', 'images', 'black-bg.png');
  fs.writeFileSync(blackPixelPath, Buffer.from(blackPixelBase64, 'base64'));
  console.log('✅ Created black background fallback image');
};

// Main execution
console.log('🚀 Creating social media assets...');
createSocialCard();
createBlackBackgroundImage();

console.log('\n📋 Summary:');
console.log('✅ Social card HTML template created');
console.log('✅ Black background fallback created');
console.log('\n🔧 Next steps:');
console.log('1. Open public/social-card.html in a browser');
console.log('2. Take a screenshot at 1200x630 resolution');
console.log('3. Save as public/images/social-card.png');
console.log('4. Test social media previews');
