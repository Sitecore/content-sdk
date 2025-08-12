import Link from 'next/link';
// import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';
// import Layout from 'src/Layout';
// import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import components from '.sitecore/component-map';

export default async function NotFound() {
  const errorPage = await client.getErrorPages({
    site: scConfig.defaultSite,
    locale: scConfig.defaultLanguage,
  });

  console.log('errorPage', errorPage);

  if (errorPage?.notFoundPage?.rendered) {
    return (
      <SitecoreProvider
        api={scConfig.api}
        componentMap={components}
        layoutData={errorPage?.notFoundPage?.rendered}
      >
        <Layout
          layoutData={errorPage?.notFoundPage?.rendered}
          pageContext={{
            route: errorPage?.notFoundPage?.rendered.sitecore.route ?? undefined,
            itemId: errorPage?.notFoundPage?.rendered.sitecore.route?.itemId,
            ...errorPage?.notFoundPage?.rendered.sitecore.context,
          }}
        />
      </SitecoreProvider>
    );
  }
  return (
    <div>
      <h2>Custom Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
