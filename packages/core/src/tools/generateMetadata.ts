import fs from 'fs';
import path from 'path';
import { Metadata } from '../editing';
import { getMetadata } from '../editing/metadata';
import { ensurePathExists } from '../utils/ensurePath';

/*
  METADATA GENERATION
  Generates the .sitecore/metadata.json file which contains application
  configuration metadata that is used for Sitecore XM Cloud integration.
*/

/**
 * Configuration options for generating metadata.
 */
export type GenerateMetadataConfig = {
  /**
   * Optional path where the generated metadata will be saved.
   * If not provided, the default '.sitecore/metadata.json' will be used.
   */
  destinationPath?: string;
};

/**
 * Generate application metadata
 * @param {GenerateMetadataConfig} config - Optional configuration for generating metadata.
 * If not provided, the default '.sitecore/metadata.json' will be used.
 * @returns {Promise<void>} A promise that resolves when the metadata generation is complete.
 */
export const generateMetadata = (config?: GenerateMetadataConfig): (() => Promise<void>) => {
  return async () => {
    const metadata: Metadata = getMetadata();
    writeMetadata(metadata, config?.destinationPath ?? '.sitecore/metadata.json');
  };
};

/**
 * Writes the metadata object to disk.
 * @param {Metadata} metadata metadata to write.
 * @param {string} destinationPath path to write the metadata to.
 */
function writeMetadata(metadata: Metadata, destinationPath: string): void {
  const filePath = path.resolve(destinationPath);

  ensurePathExists(filePath);

  console.log(`Writing metadata to ${filePath}`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2), { encoding: 'utf8' });
}
