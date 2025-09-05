import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de-DE'],

  // Used when no locale matches
  defaultLocale: 'en',

  // no prefix for default locale 'as-needed' - see next-intl docs for other options https://next-intl.dev/docs/routing/configuration
  localePrefix: 'as-needed',
});
