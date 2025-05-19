/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import {
  Placeholder,
  LayoutServiceData,
  Field,
  DesignLibrary,
  RenderingType,
} from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/SitecoreStyles';

interface LayoutProps {
  layoutData: LayoutServiceData;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ layoutData }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  const fields = route?.fields as RouteFields;
  const isPageEditing = layoutData.sitecore.context.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layoutData} />
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {layoutData.sitecore.context.renderingType === RenderingType.Component ? (
          <DesignLibrary {...layoutData} />
        ) : (
          <>
            <header>
              <div id="header">
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main>
              <div id="content">
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
