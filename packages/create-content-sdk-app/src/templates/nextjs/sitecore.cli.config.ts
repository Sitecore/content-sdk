import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateSites, generateMetadata, extractFiles, writeImportMap } from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
      extractFiles({
        scConfig: config,
      }),
      writeImportMap({
        paths: ['src/components'],
      },
      config
      ),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    // Exclude content-sdk auxillary components
    exclude: ['src/components/content-sdk/*'],
  },
});
