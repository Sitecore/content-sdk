import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import {
  generateSites,
  generateMetadata,
  generateComponentBuilder,
} from '@sitecore-content-sdk/nextjs/tools';

// TODO: support watch components
const componentsConfig = {
  componentRootPaths: ['src/components'],
  packages: [
    {
      name: '@sitecore-content-sdk/nextjs',
      components: [
        {
          componentName: 'BYOCWrapper',
          moduleName: 'BYOCWrapper',
        },
        {
          componentName: 'FEaaSWrapper',
          moduleName: 'FEaaSWrapper',
        },
      ],
    },
    {
      name: '@sitecore-content-sdk/nextjs',
      components: [
        {
          componentName: 'Form',
          moduleName: 'Form',
        },
      ],
    },
  ],
};

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
      generateComponentBuilder(componentsConfig),
    ],
  },
});
