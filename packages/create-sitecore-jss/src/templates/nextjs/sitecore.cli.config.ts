import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import { createGraphQLClientFactory } from './src/lib/graphql-client-factory/create';
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
          clientFactory: createGraphQLClientFactory(config),
        }),
      }),
    ],
  },
});
