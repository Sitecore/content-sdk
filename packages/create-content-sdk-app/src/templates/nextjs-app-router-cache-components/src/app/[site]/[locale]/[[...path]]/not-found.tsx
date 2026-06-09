import Link from 'next/link';
import { ErrorPage, getCachedPageParams } from '@sitecore-content-sdk/nextjs';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default async function NotFound() {
  const { site, locale } = getCachedPageParams();
  const resolvedSite = site || scConfig.defaultSite;
  const resolvedLocale = locale || scConfig.defaultLanguage;

  const page = await getSitecoreErrorPage({
    site: resolvedSite,
    locale: resolvedLocale,
    code: ErrorPage.NotFound,
  });

  // Set site and locale for next-intl dictionary resolution in src/i18n/request.ts.
  // Called after the cached error-page fetch so the locale is resolved from route params, not a Dynamic API.
  setRequestLocale(`${resolvedSite}_${resolvedLocale}`);

  if (page) {
    return (
      <NextIntlClientProvider>
        <Providers page={page}>
          <Layout page={page} />
        </Providers>
      </NextIntlClientProvider>
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go to the Home page</Link>
    </div>
  );
}
