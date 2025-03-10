import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/nextjs/client';
import { GraphQLSiteInfoService } from '@sitecore-content-sdk/nextjs';
import { generateSites, generateMetadata } from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        multisiteEnabled: config.multisite.enabled,
        defaultSite: {
          name: config.defaultSite,
          language: config.defaultLanguage,
          hostName: '*',
        },
        siteInfoService: new GraphQLSiteInfoService({
          clientFactory: createGraphQLClientFactory({
            api: config.api,
            retries: config.retries.count,
            retryStrategy: config.retries.retryStrategy,
          }),
        }),
      }),
    ],
  },
});
