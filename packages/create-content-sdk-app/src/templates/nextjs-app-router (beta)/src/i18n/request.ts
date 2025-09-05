import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
// import sites from '.sitecore/sites.json';
import client from 'src/lib/sitecore-client';

export default getRequestConfig(async ({ requestLocale }: GetRequestConfigParams) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  // Since this function is executed during the Server Components render pass, you can call functions like cookies() and headers() to return configuration that is request-specific. https://next-intl.dev/docs/usage/configuration

  const requested = await requestLocale;

  console.log('request.ts: requested locale');
  console.log(requested);

  const [parsedSite, parsedLocale] = requested?.split('_') || [];

  const locale = hasLocale(routing.locales, parsedLocale) ? parsedLocale : routing.defaultLocale;

  console.log('Fetching dictionary ....');

  const messages: Record<string, object> = {};
  messages[parsedSite] = await client.getDictionary({
    locale,
    site: parsedSite,
  });
  console.log('Fetching dictionary for site: ', parsedSite, ' locale: ', locale);

  return {
    locale,
    messages,
  };
});
