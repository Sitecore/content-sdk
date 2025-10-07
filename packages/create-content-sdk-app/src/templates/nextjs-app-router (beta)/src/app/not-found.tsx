import Link from 'next/link';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  const site = scConfig.defaultSite;
  const page = site
    ? await client.getErrorPage(ErrorPage.NotFound, {
        site,
        locale: scConfig.defaultLanguage,
      })
    : null;

  if (page) {
    return (
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
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
