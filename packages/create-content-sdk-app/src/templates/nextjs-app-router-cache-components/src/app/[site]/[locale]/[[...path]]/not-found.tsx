import Link from 'next/link';
import { ErrorPage, getCachedPageParams } from '@sitecore-content-sdk/nextjs';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import { resolveSitecoreRouteContext } from 'lib/cache/resolve-sitecore-route-context';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';

export default async function NotFound() {
  const cached = getCachedPageParams();
  const context = resolveSitecoreRouteContext(cached);

  const page = context
    ? await getSitecoreErrorPage({
        site: context.site,
        locale: context.locale,
        code: ErrorPage.NotFound,
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
