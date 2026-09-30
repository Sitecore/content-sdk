import { defineRouting } from 'next-intl/routing';
import sitecoreConfig from 'sitecore.config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [sitecoreConfig.defaultLanguage],

  // Used when no locale matches
  defaultLocale: sitecoreConfig.defaultLanguage,

  // Out of the box, syncs with the `appLocalePrefix` redirects setting for consistent behavior
  // For "as-needed" value, no prefix is added for the default locale .
  // For other configuration options, refer to the next-intl documentation:
  // https://next-intl.dev/docs/routing/configuration
  localePrefix: sitecoreConfig.redirects?.appLocalePrefix || 'as-needed',
});
