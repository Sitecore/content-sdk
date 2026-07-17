import { JSX } from 'react';
import {  DesignLibraryApp, Field, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import componentMap from '.sitecore/component-map';

interface LayoutProps {
  page: Page;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <DesignLibraryApp
        page={page}
        rendering={route}
        componentMap={componentMap}
        loadServerImportMap={() => import('.sitecore/import-map.server')}
      />
    </>
  );
};

export default Layout;
