import Link from 'next/link';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

export default async function NotFound() {
  if (scConfig.defaultSite) {
    const page = await getSitecoreErrorPage({
      site: scConfig.defaultSite,
      locale: scConfig.defaultLanguage,
      code: ErrorPage.NotFound,
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
