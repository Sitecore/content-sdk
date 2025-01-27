import React from 'react';
import { LayoutServicePageState } from '@sitecore-jss/sitecore-jss/layout';
import { useSitecoreContext } from '../enhancers/withSitecoreContext';
import { getJssPagesClientData } from '@sitecore-jss/sitecore-jss/editing';

/**
 * Renders client scripts and data for editing/preview mode in Pages.
 */
export const EditingScripts = (): JSX.Element => {
  const {
    sitecoreContext: { pageState, clientData, clientScripts },
  } = useSitecoreContext();

  // Don't render anything if not in editing/preview mode
  if (
    pageState === LayoutServicePageState.Normal ||
    pageState === LayoutServicePageState.Preview ||
    !pageState
  ) {
    return <></>;
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
