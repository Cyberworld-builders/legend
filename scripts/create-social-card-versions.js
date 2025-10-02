const fs = require('fs');
const path = require('path');

// Create both versions of the social card - one for direct file access and one for web server

const createSocialCardVersions = () => {
  console.log('🚀 Creating social card versions...');
  
  // Version 1: For direct file access (relative path)
  const directAccessHTML = `
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
      width: 100px;
      height: 100px;
      border: 2px solid #00ff00;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      overflow: hidden;
    }
    
    .logo img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #00ff00;
      margin-bottom: 10px;
      text-shadow: 0 0 6px #00ff00;
    }
    
    .subtitle {
      font-size: 16px;
      color: #00ff00;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    
    .url {
      font-size: 12px;
      color: #00ff00;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <img src="icons/favicon-32x32.png" alt="CyberWorld Builders Logo" />
    </div>
    <div class="title">CyberWorld Builders</div>
    <div class="subtitle">Software Engineering & Consulting Services</div>
    <div class="url">cyberworldbuilders.com</div>
  </div>
</body>
</html>`;

  // Version 2: For web server access (absolute path)
  const webServerHTML = `
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
      width: 100px;
      height: 100px;
      border: 2px solid #00ff00;
      border-radius: 50%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      overflow: hidden;
    }
    
    .logo img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #00ff00;
      margin-bottom: 10px;
      text-shadow: 0 0 6px #00ff00;
    }
    
    .subtitle {
      font-size: 16px;
      color: #00ff00;
      opacity: 0.9;
      margin-bottom: 12px;
    }
    
    .url {
      font-size: 12px;
      color: #00ff00;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <img src="/icons/favicon-32x32.png" alt="CyberWorld Builders Logo" />
    </div>
    <div class="title">CyberWorld Builders</div>
    <div class="subtitle">Software Engineering & Consulting Services</div>
    <div class="url">cyberworldbuilders.com</div>
  </div>
</body>
</html>`;

  // Write both versions
  const directPath = path.join(process.cwd(), 'public', 'social-card-direct.html');
  const webPath = path.join(process.cwd(), 'public', 'social-card-web.html');
  
  fs.writeFileSync(directPath, directAccessHTML);
  fs.writeFileSync(webPath, webServerHTML);
  
  console.log('✅ Created social card versions:');
  console.log('   📁 public/social-card-direct.html (for direct file access)');
  console.log('   📁 public/social-card-web.html (for web server access)');
  console.log('');
  console.log('📝 To create the social media image:');
  console.log('   1. Open public/social-card-direct.html in your browser');
  console.log('   2. Take a screenshot at 1200x630 resolution');
  console.log('   3. Save as public/images/social-card.png');
  console.log('');
  console.log('🎯 The logo should now load properly using the PNG favicon!');
};

// Main execution
createSocialCardVersions();
