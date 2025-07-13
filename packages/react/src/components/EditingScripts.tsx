import React, { JSX } from 'react';
import { useSitecore } from '../enhancers/withSitecore';
import { getContentSdkPagesClientData } from '@sitecore-content-sdk/core/editing';
import { getDesignLibraryScriptLink } from '@sitecore-content-sdk/core/editing';

/**
 * Renders client scripts and data for editing/preview mode for Pages.
 * Renders script required for the Design Library (when mode.isDesignLibrary is true).
 * @returns A JSX element containing the editing scripts or an empty fragment if not in editing/preview mode.
 */
export const EditingScripts = (): JSX.Element => {
  const {
    page: { mode, layout },
    api,
  } = useSitecore();

  const { clientData, clientScripts } = layout.sitecore.context;

  // Don't render anything if not in editing/preview mode and rendering type is not component
  if (mode.isNormal) {
    return <></>;
  }

  // In case of Design Library - render only the script for Design Library
  if (mode.isDesignLibrary) {
    // Add cache buster to the script URL
    const scriptUrl = `${getDesignLibraryScriptLink(api?.edge?.edgeUrl)}?cb=${Date.now()}`;

    return (
      <>
        <script src={scriptUrl} suppressHydrationWarning></script>
      </>
    );
  }

  const contentSdkClientData = { ...clientData, ...getContentSdkPagesClientData() };

  return (
    <>
      {clientScripts?.map((src, index) => (
        <script src={src} key={index} />
      ))}
      {Object.keys(contentSdkClientData).map((id) => (
        <script
          key={id}
          id={id}
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contentSdkClientData[id]) }}
        />
      ))}
    </>
  );
};
