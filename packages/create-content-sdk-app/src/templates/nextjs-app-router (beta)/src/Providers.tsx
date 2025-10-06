'use client';
import React from 'react';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

// Always use client-safe component map to maintain server/client boundary
// eslint-disable-next-line @typescript-eslint/no-require-imports
const components = require('.sitecore/component-map.client').default;

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
