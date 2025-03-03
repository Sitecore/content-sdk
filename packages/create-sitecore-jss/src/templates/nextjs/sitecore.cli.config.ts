import config from './sitecore.config';
// import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';
import { createGraphQLClientFactory } from './src/lib/graphql-client-factory/create';
import { GraphQLSiteInfoService } from '@sitecore-content-sdk/nextjs';

// const { generateMetadata } = require('@sitecore-content-sdk/dev-tools/scripts');
// const { generateSites } = require('@sitecore-content-sdk/nextjs/tools');
import { generateSites, generateMetadata } from '@sitecore-content-sdk/nextjs/tools';

// import { generateSites } from '@sitecore-content-sdk/nextjs/tools';

// const elephant = (elephantName: string) => {
//   console.log(`hey frooooooom ${elephantName} the elemphant`);
// };

// const siteInfoService = new GraphQLSiteInfoService({
//   clientFactory: createGraphQLClientFactory(config),
// });

// console.log('config', config);

module.exports = {
  build: {
    commands: [
      generateSites({
        multiSiteEnabled: config.multisite.enabled,
        defaultSite: {
          name: config.defaultSite,
          language: config.defaultLanguage,
          hostName: '*',
        },
        siteInfoService: new GraphQLSiteInfoService({
          clientFactory: createGraphQLClientFactory(config),
        }),
      }),
      generateMetadata(),
    ],
  },
  //   scaffold: {
  //     tempates: {
  //       name,
  //       templateFn: () => {},
  //     },
  //   },
};
