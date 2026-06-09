import fs from 'fs';
import path from 'path';

/**
 * Ensures the Sitecore output directory exists, creating it if necessary.
 * @param {string} destination Relative path to the output directory.
 */
export function ensureSitecoreDirectory(destination = '.sitecore') {
  const outputPath = path.resolve(process.cwd(), destination);
  if (!fs.existsSync(outputPath)) {
    console.log('[Codegen] Creating Sitecore directory:', destination);
    fs.mkdirSync(outputPath, { recursive: true });
  }
}
