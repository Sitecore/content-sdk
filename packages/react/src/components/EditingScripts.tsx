import React from 'react';
import { LayoutServicePageState, RenderingType } from '@sitecore-content-sdk/core/layout';
import { useSitecoreContext } from '../enhancers/withSitecoreContext';
import { getJssPagesClientData } from '@sitecore-content-sdk/core/editing';
import { getDesignLibraryScriptLink } from '@sitecore-content-sdk/core/editing';

/**
 * Props for the EditingScripts component.
 */
export type EditingScriptsProps = {
  /**
   * Sitecore Edge Platform URL.
   */
  sitecoreEdgeUrl?: string;
};

/**
 * Renders client scripts and data for editing/preview mode for Pages.
 * Renders script required for the Design Library (when RenderingType is `component`).
 * @param {EditingScriptsProps} props - The props for the EditingScripts component.
 * @param {string} props.sitecoreEdgeUrl - Sitecore Edge Platform URL.
 * @returns A JSX element containing the editing scripts or an empty fragment if not in editing/preview mode.
 */
export const EditingScripts = (props: EditingScriptsProps): JSX.Element => {
  const {
    sitecoreContext: { pageState, clientData, clientScripts, renderingType },
  } = useSitecoreContext();

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
    return (
      <>
        <script src={getDesignLibraryScriptLink(props.sitecoreEdgeUrl)}></script>
      </>
    );
  }

  const jssClientData = { ...clientData, ...getJssPagesClientData() };

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
