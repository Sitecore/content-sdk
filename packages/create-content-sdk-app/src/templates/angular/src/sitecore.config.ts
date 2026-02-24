// This file is server-side only.
// defineConfig imports from @sitecore-content-sdk/core/tools (fs, path, child_process)
// and must NOT be imported in browser-side bundles (app.config.ts).
// Import this only from server config files (app.config.server.ts or loaders).
import { defineConfig } from '@sitecore-content-sdk/angular';

export default defineConfig({
  defaultSite: 'site1',
  defaultLanguage: 'en',
});
