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

  const page = await getSitecoreErrorPage({
    site: site || scConfig.defaultSite,
    locale: locale || scConfig.defaultLanguage,
    code: ErrorPage.NotFound,
  });

  // After the cached error-page fetch so next-intl's cached dictionary read does not hit DYNAMIC_SERVER_USAGE.
  setRequestLocale(`${site || scConfig.defaultSite}_${locale || scConfig.defaultLanguage}`);

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
