import React from 'react';
import { DesingLibraryAppProps } from './models';
import { DesignLibraryLowCodeComponent } from '@sitecore-content-sdk/react';

/**
 * Design Library component intended to be used by the NextJs app router application
 * This component serves as a router between client and server component rendering modes for the Design Library.
 * It inspects the component type from the component map and
 * delegates to the appropriate rendering implementation:
 * - Client components are rendered using the `DesignLibrary` component
 * - Server components are rendered using the `DesignLibraryServer` component
 * - Low code components are rendered using the `DesignLibraryLowCodeComponent` component
 * @param {DesingLibraryAppProps} props - The properties for the Design Library App.
 * @public
 */
export const DesignLibraryApp = ({ page }: DesingLibraryAppProps) => {
  const { route } = page.layout.sitecore;
  if (!route) return null;

  return (
    <>
      <DesignLibraryLowCodeComponent />
    </>
  );
};
