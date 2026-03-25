import { defineConfig } from '@sitecore-content-sdk/angular';
import { environment } from './src/environments/environment';

/**
 * Sitecore configuration driven by generated environment.
 * @see scripts/generate-environment.ts
 * @see https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({}, environment);
