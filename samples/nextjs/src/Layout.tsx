/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import {
  LayoutServiceData,
  Field,
  DesignLibrary,
  RenderingType,
  ComponentMap,
  SitecoreProviderPageContext,
  ServerPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/SitecoreStyles';

interface LayoutProps {
  layoutData: LayoutServiceData;
  componentMap?: ComponentMap;
  pageContext: SitecoreProviderPageContext;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ layoutData, componentMap, pageContext }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  const isPageEditing = layoutData.sitecore.context.pageEditing;
  const mainClassPageEditing = isPageEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layoutData} />
      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {layoutData.sitecore.context.renderingType === RenderingType.Component ? (
          <DesignLibrary {...layoutData} />
        ) : (
          <>
            <header>
              <div id="header">
                {route && (
                  <ServerPlaceholder
                    pageContext={pageContext}
                    componentMap={componentMap!}
                    name="headless-header"
                    rendering={route}
                  />
                )}
              </div>
            </header>
            <main>
              <div id="content">
                {route && (
                  <ServerPlaceholder
                    pageContext={pageContext}
                    componentMap={componentMap!}
                    name="headless-main"
                    rendering={route}
                  />
                )}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && (
                  <ServerPlaceholder
                    pageContext={pageContext}
                    componentMap={componentMap!}
                    name="headless-footer"
                    rendering={route}
                  />
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
