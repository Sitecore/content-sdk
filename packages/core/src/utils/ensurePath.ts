import fs from 'fs';
import path from 'path';

/**
 * Ensures that the directory path for the given file path exists.
 * If the directory does not exist, it will be created recursively.
 * @param {string} filePath - The file path for which to ensure the directory exists.
 */
export const ensurePathExists = (filePath: string) => {
  const outputDir = path.dirname(filePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};
