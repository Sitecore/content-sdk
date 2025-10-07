import Link from 'next/link';
import { headers } from 'next/headers';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import { parseRewriteHeader } from '@sitecore-content-sdk/nextjs/utils';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  const headersList = await headers();
  const { site, locale } = parseRewriteHeader(headersList);

  const resolvedSite = site || scConfig.defaultSite;
  const resolvedLocale = locale || scConfig.defaultLanguage;
  const page = resolvedSite
    ? await client.getErrorPage(ErrorPage.NotFound, {
        site: resolvedSite,
        locale: resolvedLocale,
      })
    : null;

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
