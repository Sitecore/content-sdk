import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
// Single source of truth derived from env
const isEditingHost = !!process.env.SITECORE_EDITING_SECRET;

export default defineConfig({
  // Persist the flag on config so other parts of the app can read it
  isEditingHost,
  // Use the flag instead of re-deriving from env
  disableCodeGeneration: !isEditingHost,
});
