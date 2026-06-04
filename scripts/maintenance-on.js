import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Maintenance site deploy -- npm run deploy:maintenance
// Normal site deploy -- npm run deploy:live

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(
  __dirname,
  "../src/config/siteConfig.ts"
);

const content = `export const SITE_CONFIG = {
  maintenance: true,
};
`;

fs.writeFileSync(filePath, content);

console.log("Maintenance Mode Enabled");