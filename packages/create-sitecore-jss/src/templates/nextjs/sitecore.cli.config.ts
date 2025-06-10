import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import { generateSites, generateMetadata, generateMap } from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
    ],
  },
  generateComponentMap: {
    commands: [
      generateMap({
        paths: ['src/components'],
      }),
    ],
  },
});
