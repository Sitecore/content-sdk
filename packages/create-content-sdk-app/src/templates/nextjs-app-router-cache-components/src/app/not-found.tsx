import Link from 'next/link';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import { resolveSitecoreRouteContext } from 'lib/cache/resolve-sitecore-route-context';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

export default async function NotFound() {
  const context = resolveSitecoreRouteContext();

  if (context) {
    const page = await getSitecoreErrorPage({
      site: context.site,
      locale: context.locale,
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
