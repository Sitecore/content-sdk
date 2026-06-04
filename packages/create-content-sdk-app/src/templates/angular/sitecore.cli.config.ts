import { defineCliConfig } from '@sitecore-content-sdk/angular/config-cli';

/**
 * Sitecore CLI configuration (Node / build-time only). This file is not part of the Angular
 * compiler `include` set and is only loaded by `sitecore-tools`.
 */
export default defineCliConfig({
  componentMap: {
    paths: ['src/app/components'],
    exclude: ['**/*.spec.ts'],
  },
});
