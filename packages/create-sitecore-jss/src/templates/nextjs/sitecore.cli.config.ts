import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import { generateSites, generateMetadata, extractComponents } from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
      extractComponents({
        scConfig: config,
      }),
    ],
  },
});
