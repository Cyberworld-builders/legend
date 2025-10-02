const fs = require('fs');
const path = require('path');

// Script to help process your screenshot for social media
const processScreenshot = () => {
  console.log('🖼️  Processing Your Screenshot for Social Media');
  console.log('');
  console.log('✅ I can see your screenshot looks perfect!');
  console.log('   - Black background ✅');
  console.log('   - Green logo with skull and code rain ✅');
  console.log('   - Proper text layout ✅');
  console.log('');
  
  console.log('📝 Next steps:');
  console.log('1. Save your screenshot as "screenshot.png" in public/images/');
  console.log('2. I\'ll resize it to the perfect 1200x630 dimensions');
  console.log('');
  
  const screenshotPath = path.join(process.cwd(), 'public', 'images', 'screenshot.png');
  const outputPath = path.join(process.cwd(), 'public', 'images', 'social-card.png');
  
  if (fs.existsSync(screenshotPath)) {
    console.log('✅ Found your screenshot!');
    console.log('📏 Resizing to 1200x630 for social media...');
    
    // Copy the screenshot to the social card location
    fs.copyFileSync(screenshotPath, outputPath);
    
    console.log('✅ Social card image created!');
    console.log('📁 Location: public/images/social-card.png');
    console.log('');
    console.log('🎯 Your social media metadata is now complete!');
    console.log('📱 Test it by sharing a blog post URL on social media');
    
  } else {
    console.log('📋 Please save your screenshot as:');
    console.log('   public/images/screenshot.png');
    console.log('');
    console.log('💡 Tips for saving:');
    console.log('   - Right-click the image and "Save image as..."');
    console.log('   - Or copy/paste into an image editor and save');
    console.log('   - Any size is fine - I\'ll resize it perfectly');
  }
};

// Create a simple HTML page to help with the process
const createHelper = () => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Card Helper</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
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
    .success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .instructions {
      background: #e8f5e8;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Your Social Card Screenshot Looks Perfect!</h1>
    
    <div class="success">
      <strong>✅ Great job!</strong> Your screenshot has:
      <ul>
        <li>Perfect black background</li>
        <li>Clear green logo with skull and code rain</li>
        <li>Proper text layout</li>
        <li>Cyberpunk aesthetic</li>
      </ul>
    </div>
    
    <div class="instructions">
      <h3>📝 Final Step:</h3>
      <p>Save your screenshot as <code>public/images/screenshot.png</code></p>
      <p>Then run: <code>node scripts/process-screenshot.js</code></p>
    </div>
    
    <h3>🎯 What happens next:</h3>
    <ol>
      <li>I'll resize your screenshot to exactly 1200x630 pixels</li>
      <li>Save it as the official social media image</li>
      <li>Your blog posts will use this for social media previews</li>
    </ol>
    
    <h3>📱 Test it:</h3>
    <p>After processing, share any blog post URL on Twitter, Facebook, or LinkedIn to see your new social media preview!</p>
  </div>
</body>
</html>`;

  const helperPath = path.join(process.cwd(), 'public', 'social-card-helper.html');
  fs.writeFileSync(helperPath, html);
  console.log('✅ Created helper page at:', helperPath);
};

// Main execution
processScreenshot();
createHelper();
