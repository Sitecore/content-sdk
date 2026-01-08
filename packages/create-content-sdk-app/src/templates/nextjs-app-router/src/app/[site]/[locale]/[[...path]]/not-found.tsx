import Link from 'next/link';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import { parseRewriteHeader } from '@sitecore-content-sdk/nextjs/utils';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';

// Component that handles headers access and error page fetching (uncached data access)
async function NotFoundContent() {
  const headersList = await headers();
  const { site, locale } = parseRewriteHeader(headersList);

  const page = await client.getErrorPage(ErrorPage.NotFound, {
    site: site || scConfig.defaultSite,
    locale: locale || scConfig.defaultLanguage,
  });

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

export default function NotFound() {
  // Wrap the dynamic content in Suspense for Next.js 16 PPR compatibility
  return (
    <Suspense
      fallback={
        <div style={{ padding: 10 }}>
          <h1>Page not found</h1>
          <p>Loading...</p>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
