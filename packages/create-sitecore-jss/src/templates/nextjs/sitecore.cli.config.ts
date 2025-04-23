import config from './sitecore.config';
import tsConfig from './tsconfig.json';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import {
  generateSites,
  generateMetadata,
  validateConsent,
  validateBuildContext,
  extractComponents,
} from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
    ],
  },
  extractCode: {
    commands: [
      validateConsent(),
      validateBuildContext(),
      extractComponents({
        scConfig: config,
        compilerOptions: tsConfig.compilerOptions,
      }),
    ],
  },
});
