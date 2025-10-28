'use client';
import { DesignLibrary } from '@sitecore-content-sdk/nextjs';

export const DesignLibraryLayout = () => {
  const importMapDynamic = () => import('.sitecore/import-map');
  return <DesignLibrary loadImportMap={importMapDynamic} />;
};
