'use client';
import React from 'react';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { catalog, registry } from 'src/atoms';

export default function Providers({ children, page }: { children: React.ReactNode; page: Page }) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
      atoms={{ catalog, registry }}
    >
      {children}
    </SitecoreProvider>
  );
}
