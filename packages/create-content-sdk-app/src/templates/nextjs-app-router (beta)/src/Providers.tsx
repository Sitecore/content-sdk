'use client';
import React from 'react';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
  ComponentMap,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

// Conditionally import component map based on availability
let components: ComponentMap;
try {
  // Try to import client-specific map first (App Router with dual maps)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  components = require('.sitecore/component-map.client').default;
} catch {
  // Fallback to main component map (Pages Router or single map mode)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  components = require('.sitecore/component-map').default;
}

export default function Providers({
  children,
  page,
  componentProps = {},
}: {
  children: React.ReactNode;
  page: Page;
  componentProps?: ComponentPropsCollection;
}) {
  return (
    <SitecoreProvider api={scConfig.api} componentMap={components} page={page}>
      <ComponentPropsContext value={componentProps}>{children}</ComponentPropsContext>
    </SitecoreProvider>
  );
}
