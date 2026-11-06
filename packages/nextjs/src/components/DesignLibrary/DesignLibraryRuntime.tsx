import React from 'react';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/content/layout';
import { DesingLibraryAppProps } from './models';
import { DesignLibraryServer } from './DesignLibraryServer';
import { DesignLibrary, noopLoadImportMap } from '@sitecore-content-sdk/react';

/**
 * Internal Design Library renderer. Routes between client and server
 * implementations after `DesignLibraryApp` has authorized the request.
 * @param {DesingLibraryAppProps} props - The properties for the Design Library App.
 * @internal
 */
export const DesignLibraryRuntime = ({
  page,
  componentMap,
  loadServerImportMap = noopLoadImportMap,
}: DesingLibraryAppProps) => {
  const { route } = page.layout.sitecore;
  if (!route) return null;

  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const component = componentMap.get(rendering?.componentName || '');
  const isClient = component && component.componentType === 'client';

  return (
    <>
      {isClient ? (
        <DesignLibrary />
      ) : (
        <DesignLibraryServer
          page={page}
          componentMap={componentMap}
          loadServerImportMap={loadServerImportMap}
          rendering={route}
        />
      )}
    </>
  );
};
