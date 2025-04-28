import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import { generateSites, generateMetadata } from '@sitecore-content-sdk/nextjs/tools';
import { extractComponents } from '@sitecore-content-sdk/cli';

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
  api: {
    auth: {
      clientId: process.env.SITECORE_AUTH_CLIENT_ID || '',
      clientSecret: process.env.SITECORE_AUTH_CLIENT_SECRET || '',
      endpoint: process.env.SITECORE_AUTH_ENDPOINT,
      audience: process.env.SITECORE_AUTH_AUDIENCE,
    },
  },
});
