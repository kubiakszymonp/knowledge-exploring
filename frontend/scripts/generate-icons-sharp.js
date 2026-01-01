// Script to generate PWA icons from SVG using sharp
// Requires: npm install sharp --save-dev
// Usage: node scripts/generate-icons-sharp.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSizes = [192, 512];
const inputSvg = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    if (!fs.existsSync(inputSvg)) {
      console.error('❌ icon.svg not found at:', inputSvg);
      process.exit(1);
    }

    console.log('🔄 Generating PWA icons...');

    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    console.log('');
    console.log('✨ All icons generated successfully!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ sharp module not found. Please install it:');
      console.error('   npm install sharp --save-dev');
    } else {
      console.error('❌ Error generating icons:', error.message);
    }
    process.exit(1);
  }
}

generateIcons();

