const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'public', 'assets', 'images');
const supportedExt = new Set(['.png', '.jpg', '.jpeg']);

async function convertAll() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory not found: ${imagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir);
  const targets = files.filter((file) => supportedExt.has(path.extname(file).toLowerCase()));

  if (targets.length === 0) {
    console.log('No PNG/JPG images found.');
    return;
  }

  let converted = 0;

  for (const file of targets) {
    const inputPath = path.join(imagesDir, file);
    const outputName = `${path.parse(file).name}.webp`;
    const outputPath = path.join(imagesDir, outputName);

    if (fs.existsSync(outputPath)) {
      console.log(`Skip (already exists): ${outputName}`);
      continue;
    }

    await sharp(inputPath)
      .webp({ quality: 80, effort: 4 })
      .toFile(outputPath);

    converted += 1;
    console.log(`Converted: ${file} -> ${outputName}`);
  }

  console.log(`Done. Converted ${converted} files.`);
}

convertAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
