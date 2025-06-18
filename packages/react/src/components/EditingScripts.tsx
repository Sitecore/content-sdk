import React, { JSX } from 'react';
import { LayoutServicePageState, RenderingType } from '@sitecore-content-sdk/core/layout';
import { useSitecore } from '../enhancers/withSitecore';
import { getContentSdkPagesClientData } from '@sitecore-content-sdk/core/editing';
import { getDesignLibraryScriptLink } from '@sitecore-content-sdk/core/editing';

/**
 * Renders client scripts and data for editing/preview mode for Pages.
 * Renders script required for the Design Library (when RenderingType is `component`).
 * @returns A JSX element containing the editing scripts or an empty fragment if not in editing/preview mode.
 */
export const EditingScripts = (): JSX.Element => {
  const {
    pageContext: { pageState, clientData, clientScripts, renderingType },
    api,
  } = useSitecore();

  // Don't render anything if not in editing/preview mode and rendering type is not component
  if (
    renderingType !== RenderingType.Component &&
    (pageState === LayoutServicePageState.Normal ||
      pageState === LayoutServicePageState.Preview ||
      !pageState)
  ) {
    return <></>;
  }

  // In case of RenderingType.Component - render only the script for Design Libnrary
  if (renderingType === RenderingType.Component) {
    // Add cache buster to the script URL
    const scriptUrl = `${getDesignLibraryScriptLink(api?.edge?.edgeUrl)}?cb=${Date.now()}`;

    return (
      <>
        <script src={scriptUrl} suppressHydrationWarning></script>
      </>
    );
  }

  const jssClientData = { ...clientData, ...getContentSdkPagesClientData() };

  return (
    <>
      {clientScripts?.map((src, index) => (
        <script src={src} key={index} />
      ))}
      {Object.keys(jssClientData).map((id) => (
        <script
          key={id}
          id={id}
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jssClientData[id]) }}
        />
      ))}
    </>
  );
};
