const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage(inputPath, outputPath) {
  try {
    const img = sharp(inputPath);
    const { data, info } = await img
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Loop through pixels and make white (or near white) transparent
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If the pixel is near white (e.g. > 240 for R, G, and B)
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      } else {
        // Simple anti-aliasing/blending for edge pixels? 
        // We can leave it for now or do a slightly more advanced check.
        // If it's a little grey/blue due to compression near the edge, maybe leave it alone.
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
    .png()
    .toFile(outputPath);
    console.log(`Processed ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

const mainLogoIn = 'C:/Users/91921/.gemini/antigravity/brain/580df0eb-5904-4609-ac0e-f8fc199ecb2e/.user_uploaded/media_1788702792756.jpg';
const faviconIn = 'C:/Users/91921/.gemini/antigravity/brain/580df0eb-5904-4609-ac0e-f8fc199ecb2e/.user_uploaded/media_1788702794929.jpg';

const mainLogoOut = path.join(__dirname, 'public', 'images', 'logo.png');
const faviconOut = path.join(__dirname, 'public', 'images', 'favicon.png');
const appIconOut = path.join(__dirname, 'src', 'app', 'icon.png');

async function run() {
  if (!fs.existsSync(path.join(__dirname, 'public', 'images'))) {
    fs.mkdirSync(path.join(__dirname, 'public', 'images'), { recursive: true });
  }
  await processImage(mainLogoIn, mainLogoOut);
  await processImage(faviconIn, faviconOut);
  fs.copyFileSync(faviconOut, appIconOut);
  console.log('App icon updated.');
}

run();
