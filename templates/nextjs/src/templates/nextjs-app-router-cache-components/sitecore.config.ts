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
    // Locale prefix strategy for App Router redirect targets, matching next-intl's
    // `localePrefix` in src/i18n/routing.ts. `as-needed` keeps the default locale bare
    // and only prefixes non-default locales. Use `always` if routing prefixes every locale.
    appLocalePrefix: 'as-needed',
  },
});
