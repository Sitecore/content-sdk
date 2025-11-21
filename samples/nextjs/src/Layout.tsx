/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import { Field, Page } from '@sitecore-content-sdk/nextjs';
// import Scripts from 'src/Scripts';
// import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
import Search from './components/Search/Search';
import InfiniteSearch from 'components/Search/InfiniteSearch';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  // const importMapDynamic = () => import('.sitecore/import-map');

  return (
    <>
      {/* <Scripts /> */}
      {/* <SitecoreStyles layoutData={layout} /> */}
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        <>
          <header>
            <div id="header">
              {/* {route && <Placeholder name="headless-header" rendering={route} />} */}
            </div>
          </header>
          <main>
            <div id="content">
              <Search />
              {/* <InfiniteSearch /> */}
              {/* <Placeholder name="headless-main" rendering={route!} /> */}
            </div>
          </main>
          <footer>
            <div id="footer">
              {/* {route && <Placeholder name="headless-footer" rendering={route} />} */}
            </div>
          </footer>
        </>
      </div>
    </>
  );
};

export default Layout;
