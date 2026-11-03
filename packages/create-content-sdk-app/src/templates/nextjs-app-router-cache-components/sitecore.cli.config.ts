import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import { getAtomsMetadata } from '@sitecore-content-sdk/nextjs/atoms';
import scConfig from './sitecore.config';
import { catalog } from 'src/atoms';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata({
        customSections: { ...getAtomsMetadata(catalog) },
      }),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  atoms: {
    validation: {
      breakOnError: false,
    },
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*'],
  },
});

