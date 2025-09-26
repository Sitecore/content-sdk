'use client';
import React from 'react';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import components from '.sitecore/component-map.client';
import scConfig from 'sitecore.config';

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
