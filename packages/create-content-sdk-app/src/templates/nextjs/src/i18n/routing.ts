import { defineRouting } from 'next-intl/routing';
import sitecoreConfig from 'sitecore.config';

/**
 * Shared routing/i18n definition for the Pages Router head app.
 *
 * Unlike the App Router, the Pages Router does NOT use next-intl's middleware or
 * `getRequestConfig` (those are RSC-only). This definition is used as the single
 * source of truth for:
 *  - the list of supported `locales` consumed by `LocaleProxy` (in `src/proxy.ts`)
 *    and by `getStaticPaths` when generating localized routes, and
 *  - the `localePrefix` shaping, kept in sync with the `appLocalePrefix` redirects
 *    setting so redirect/proxy behavior matches the App Router.
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [sitecoreConfig.defaultLanguage],

  // Used when no locale matches
  defaultLocale: sitecoreConfig.defaultLanguage,

  // Syncs with the `appLocalePrefix` redirects setting for consistent behavior with
  // the App Router. For "as-needed", no prefix is added for the default locale.
  localePrefix: sitecoreConfig.redirects?.appLocalePrefix || 'as-needed',
});
