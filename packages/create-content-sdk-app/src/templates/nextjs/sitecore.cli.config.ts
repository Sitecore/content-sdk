import { ATOMS_CATALOG_METADATA_KEY } from '@sitecore-content-sdk/nextjs/atoms';
import scConfig from './sitecore.config';
import { catalog } from 'src/atoms';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata({
        appInputs: { [ATOMS_CATALOG_METADATA_KEY]: catalog },
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
    // Exclude content-sdk auxillary components
    exclude: ['src/components/content-sdk/*'],
  },
});

