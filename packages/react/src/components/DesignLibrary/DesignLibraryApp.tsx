import React from 'react';
import { DesingLibraryAppProps } from './models';

/**
 * Design Library component intended to be used by the NextJs app router application.
 * This component serves as a router between client and server component rendering modes
 * for the Design Library. The client/server runtime is loaded lazily so static import
 * of `DesignLibrary` / `DesignLibraryServer` does not pull those modules into every render.
 * @param {DesingLibraryAppProps} props - The properties for the Design Library App.
 * @public
 */
export const DesignLibraryApp = async (
  props: DesingLibraryAppProps
): Promise<React.JSX.Element | null> => {
  if (!props.page.layout.sitecore.route) return null;

  const { DesignLibraryRuntime } = await import('./DesignLibraryRuntime');
  return <DesignLibraryRuntime {...props} />;
};
