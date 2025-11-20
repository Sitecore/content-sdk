import React from 'react';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/core/layout';
import { DesingLibraryAppProps } from './models';
import { DesignLibraryServer } from './DesignLibraryServer';
import { DesignLibrary } from './DesignLibrary';

/**
 * Design Library component intended to be used by the NextJs app router application
 * This component serves as a router between client and server component rendering modes for the Design Library.
 * It inspects the component type from the component map and
 * delegates to the appropriate rendering implementation:
 * - Client components are rendered using the `DesignLibrary` component
 * - Server components are rendered using the `DesignLibraryServer` component
 * @param {DesingLibraryAppProps} props - The properties for the Design Library App.
 * @public
 */
export const DesignLibraryApp = ({
  page,
  componentMap,
  loadServerImportMap,
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
