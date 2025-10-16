import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {
      locale: routing.defaultLocale,
      messages: {},
    };
  }

  return {
    locale,
    messages: {},
  };
});
