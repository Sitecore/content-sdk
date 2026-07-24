import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * DictionaryService in-process memory cache is disabled: it is separate from Next.js Cache Components
 * (`use cache` / `cacheTag`) and is not cleared by `revalidateTag`. This template relies on tag-based
 * dictionary caching in `getSitecoreDictionary` instead.
 */
export default defineConfig({
  dictionary: {
    caching: {
      enabled: false,
    },
  },
  redirects: {
    // Routes live under a [locale] segment (src/app/[site]/[locale]),
    // so redirect targets must include the locale prefix to resolve.
    localeInPath: true,
  },
});
