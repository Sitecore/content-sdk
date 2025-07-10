'use client';

import { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs/react-client';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';

export default function Providers({
  children,
  layoutData,
}: {
  children: React.ReactNode;
  layoutData: LayoutServiceData;
}) {
  return (
    <SitecoreProvider api={scConfig.api} componentMap={components} layoutData={layoutData}>
      {children}
    </SitecoreProvider>
  );
}
