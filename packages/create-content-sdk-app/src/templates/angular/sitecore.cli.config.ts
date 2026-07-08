import {
  defineCliConfig,
  generateMetadata,
  generateSites,
} from '@sitecore-content-sdk/angular/config-cli';
import scConfig from './sitecore.config';
/**
 * Sitecore CLI configuration (Node / build-time only). This file is not part of the Angular
 * compiler `include` set and is only loaded by `sitecore-tools`.
 */
export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [generateMetadata(), generateSites()],
  },
  componentMap: {
    paths: ['src/app/components'],
    exclude: ['**/*.spec.ts'],
  },
});
