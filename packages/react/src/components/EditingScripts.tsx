'use client';
import React, { JSX, useEffect } from 'react';
import { useSitecore } from '../enhancers/withSitecore';
import {
  getContentSdkPagesClientData,
  isEditorActive,
  resetEditorChromes,
} from '@sitecore-content-sdk/core/editing';
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

  useEffect(() => {
    if (isEditorActive()) {
      resetEditorChromes();
    }
  }, []);

  const { clientData, clientScripts } = layout.sitecore.context;

  // Don't render anything if not in editing mode and rendering type is not component
  if (mode.isNormal || mode.isPreview) {
    return <></>;
  }

  // In case of Design Library - render only the script for Design Library
  if (mode.isDesignLibrary) {
    // Add cache buster to the script URL (format hh-dd-mm-yyyy, UTC)
    const now = new Date();
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const year = String(now.getUTCFullYear());
    const cacheTimestamp = `${hour}-${day}-${month}-${year}`;
    const scriptUrl = `${getDesignLibraryScriptLink(api?.edge?.edgeUrl)}?cb=${cacheTimestamp}`;
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
