'use client';
import React from 'react';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { catalog, registry } from 'src/atoms';
import { useRouter } from 'next/navigation';

export default function Providers({ children, page }: { children: React.ReactNode; page: Page }) {
  const router = useRouter();

  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
      atomsConfig={{
        catalog,
        registry,
        navigate: router.push,
        compileCssAction: compileCssForDocumentAction,
      }}
    >
      {children}
    </SitecoreProvider>
  );
}
