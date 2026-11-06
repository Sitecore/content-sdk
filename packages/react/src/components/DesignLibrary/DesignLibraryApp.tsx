import React from 'react';
import { DesingLibraryAppProps } from './models';
import { loadDesignLibraryRuntime, rsc } from '#rsc-env';

/**
 * Design Library component intended to be used by the NextJs app router application.
 * This component serves as a router between client and server component rendering modes
 * for the Design Library. The runtime loader comes from `#rsc-env`, which resolves to
 * a different module in the RSC and client bundles, so the `global-error` client chunk
 * does not reference `DesignLibraryServer`.
 * @param {DesingLibraryAppProps} props - The properties for the Design Library App.
 * @returns {Promise<React.JSX.Element | null>} The Design Library tree, or null when the page has no route.
 * @public
 */
export const DesignLibraryApp = async (
  props: DesingLibraryAppProps
): Promise<React.JSX.Element | null> => {
  if (!rsc || !props.page.layout.sitecore.route) return null;

  const { DesignLibraryRuntime } = await loadDesignLibraryRuntime();
  return <DesignLibraryRuntime {...props} />;
};
