import sharp from "sharp";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./production-images";

const QUALITY = 62;
const TARGET_WIDTH = 1536;
const TARGET_HEIGHT = 1024;

// Change this to match your page background
const PADDING_BG = { r: 255, g: 255, b: 255, alpha: 1 };
// For dark padding, use:
// const PADDING_BG = { r: 0, g: 0, b: 0, alpha: 1 };

async function compressImages() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = await fg([
      `${INPUT_DIR}/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}`,
    ]);

    console.log(`Found ${files.length} images\n`);

    for (const file of files) {
      const fileName = path.parse(file).name;
      const outputPath = path.join(OUTPUT_DIR, `${fileName}.avif`);

      await sharp(file)
        .rotate()
        .resize({
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          fit: "contain",
          position: "centre",
          background: PADDING_BG,
          withoutEnlargement: true,
        })
        .withMetadata(false)
        .avif({
          quality: QUALITY,
          effort: 9,
        })
        .toFile(outputPath);

      console.log(`✓ ${fileName}.avif`);
    }

    console.log("\nProduction images generated successfully");
  } catch (err) {
    console.error("Compression failed:");
    console.error(err);
  }
}

compressImages();