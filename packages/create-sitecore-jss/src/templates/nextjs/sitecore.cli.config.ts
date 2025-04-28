import ts from 'typescript';
import config from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config';
import {
  generateSites,
  generateMetadata,
  extractComponents,
} from '@sitecore-content-sdk/nextjs/tools';

const tsConfig = ts.readConfigFile('./tsconfig.json', ts.sys.readFile);

export default defineCliConfig({
  build: {
    commands: [
      generateMetadata(),
      generateSites({
        scConfig: config,
      }),
      extractComponents({
          scConfig: config,
          compilerOptions: tsConfig.config?.compilerOptions,
      }),
    ],
  },
});
