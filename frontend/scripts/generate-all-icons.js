// Script to generate all PWA icons from icon.png
// Requires: npm install sharp --save-dev
// Usage: node scripts/generate-all-icons.js

const fs = require('fs');
const path = require('path');

const inputIcon = path.join(__dirname, '../public/icon.png');
const outputDir = path.join(__dirname, '../public');

// All required icon sizes
const iconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  try {
    // Check if sharp is available
    let sharp;
    try {
      sharp = require('sharp');
    } catch (e) {
      console.error('❌ sharp module not found. Please install it:');
      console.error('   npm install sharp --save-dev');
      console.error('');
      console.error('Alternative: Use the HTML generator at /generate-icons.html');
      process.exit(1);
    }

    // Check if input icon exists
    if (!fs.existsSync(inputIcon)) {
      console.error('❌ icon.png not found at:', inputIcon);
      console.error('   Please place your icon.png file in the public/ folder');
      process.exit(1);
    }

    console.log('🔄 Generating PWA icons from icon.png...');
    console.log('');

    // Generate all icon sizes
    for (const icon of iconSizes) {
      const outputPath = path.join(outputDir, icon.name);
      
      await sharp(inputIcon)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 245, g: 158, b: 11, alpha: 1 } // amber-500 color
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate favicon.ico (multi-size ICO file)
    // Note: sharp doesn't support ICO format directly, so we'll create a simple PNG-based favicon
    // Most browsers accept PNG as favicon.ico
    const faviconPath = path.join(outputDir, 'favicon.ico');
    await sharp(inputIcon)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 245, g: 158, b: 11, alpha: 1 }
      })
      .png()
      .toFile(faviconPath);

    console.log(`✅ Generated: favicon.ico (32x32)`);
    console.log('');
    console.log('✨ All icons generated successfully!');
    console.log('');
    console.log('Generated files:');
    iconSizes.forEach(icon => {
      console.log(`   - ${icon.name}`);
    });
    console.log('   - favicon.ico');
    console.log('');
    console.log('Your PWA is now ready with all required icons! 🎉');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();


