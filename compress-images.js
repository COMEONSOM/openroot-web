import sharp from "sharp";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./production-images";

const QUALITY = 62;
const MAX_WIDTH = 1920;

async function compressImages() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = await fg([
      `${INPUT_DIR}/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}`
    ]);

    console.log(`Found ${files.length} images\n`);

    for (const file of files) {
      const fileName = path.parse(file).name;

      const outputPath = path.join(
        OUTPUT_DIR,
        `${fileName}.avif`
      );

      await sharp(file)
        .rotate()
        .resize({
          width: MAX_WIDTH,
          fit: "inside",
          withoutEnlargement: true,
        })

        // remove metadata
        .withMetadata(false)

        // production AVIF
        .avif({
          quality: QUALITY,
          effort: 9,
        })

        .toFile(outputPath);

      console.log(`✓ ${fileName}.avif`);
    }

    console.log(
      "\n Production images generated successfully"
    );

  } catch (err) {
    console.error("Compression failed:");
    console.error(err);
  }
}

compressImages();