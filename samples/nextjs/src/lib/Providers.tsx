'use client';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  LayoutServiceData,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';
import React from 'react';

export default function Providers({
  children,
  layoutData,
  componentProps,
}: {
  children: React.ReactNode;
  layoutData: LayoutServiceData;
  componentProps: ComponentPropsCollection;
}) {
  return (
    <>
      <SitecoreProvider api={scConfig.api} componentMap={components} layoutData={layoutData}>
        <ComponentPropsContext value={componentProps ?? {}}>{children}</ComponentPropsContext>
      </SitecoreProvider>
    </>
  );
}
