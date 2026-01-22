import Link from 'next/link';
import { Suspense } from 'react';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

// Dynamic not-found component that handles error page fetching.
// This component is wrapped in Suspense to enable Next.js 16 Partial Prerendering (PPR),
// which allows streaming dynamic content while keeping static parts prerendered.
// This pattern also works seamlessly when Cache Components is enabled.
async function DynamicNotFoundContent() {
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
  // Wrap dynamic content in Suspense to enable Next.js 16 Partial Prerendering (PPR).
  // PPR allows streaming dynamic content while keeping static parts prerendered for better performance.
  return (
    <Suspense
      fallback={
        <div style={{ padding: 10 }}>
          <h1>Page not found</h1>
          <p>Loading...</p>
        </div>
      }
    >
      <DynamicNotFoundContent />
    </Suspense>
  );
}
