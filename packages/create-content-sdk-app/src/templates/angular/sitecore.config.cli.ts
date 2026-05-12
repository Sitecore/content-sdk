/**
 * Sitecore configuration for Node-only consumers (Sitecore CLI). Uses `@sitecore-content-sdk/content`
 * so `sitecore-tools` does not load `@sitecore-content-sdk/angular` / the Angular runtime.
 * The browser app continues to use `sitecore.config.ts` with `defineConfig` from the Angular package.
 */
import { defineConfig } from '@sitecore-content-sdk/content/config';
import { environment } from './src/environments/environment';

export default defineConfig({}, { ...environment, ...process.env });
