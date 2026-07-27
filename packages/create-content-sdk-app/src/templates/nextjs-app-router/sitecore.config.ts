import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  redirects: {
    // Routes live under a [locale] segment (src/app/[site]/[locale]),
    // so redirect targets must include the locale prefix to resolve.
    localeInPath: true,
  },
});
