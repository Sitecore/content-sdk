import Link from 'next/link';
import { Suspense } from 'react';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

// Component that handles error page fetching (uncached data access)
async function NotFoundContent() {
  if (scConfig.defaultSite) {
    const page = await client.getErrorPage(ErrorPage.NotFound, {
      site: scConfig.defaultSite,
      locale: scConfig.defaultLanguage,
    });

    if (page) {
      return (
        <Providers page={page}>
          <Layout page={page} />
        </Providers>
      );
    }
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
