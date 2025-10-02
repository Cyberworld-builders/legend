const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateSocialImage() {
  console.log('🚀 Generating social media image with Puppeteer...');
  
  const htmlPath = path.join(process.cwd(), 'public', 'social-card-direct.html');
  const outputPath = path.join(process.cwd(), 'public', 'images', 'social-card.png');
  
  // Check if HTML template exists
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Social card HTML template not found at:', htmlPath);
    return;
  }
  
  let browser;
  try {
    // Launch browser
    console.log('📱 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to exact social media dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });
    
    // Load the HTML file and fix the image path
    console.log('📄 Loading HTML template...');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Convert relative path to absolute file path for Puppeteer
    const faviconPath = path.join(process.cwd(), 'public', 'icons', 'android-chrome-512x512.png');
    const fileUrl = `file://${faviconPath}`;
    htmlContent = htmlContent.replace('icons/android-chrome-512x512.png', fileUrl);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait a bit for any fonts or images to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Take screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630
      }
    });
    
    console.log('✅ Social media image generated successfully!');
    console.log('📁 Output:', outputPath);
    
    // Check file size
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);
    console.log(`📊 File size: ${fileSizeKB}KB`);
    
    if (fileSizeKB < 1000) {
      console.log('✅ File size is optimal for social media (< 1MB)');
    } else {
      console.log('⚠️  File size is larger than expected');
    }
    
  } catch (error) {
    console.error('❌ Error generating social image:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Run the script
generateSocialImage().then(() => {
  console.log('\n🎉 Social media image generation complete!');
  console.log('📝 Next steps:');
  console.log('   1. Test the generated image');
  console.log('   2. Deploy to production');
  console.log('   3. Test social media previews');
}).catch(console.error);
