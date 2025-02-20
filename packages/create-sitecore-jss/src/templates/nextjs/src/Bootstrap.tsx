import { useEffect } from 'react';
import { SitecorePageProps } from 'lib/page-props';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import { runtimeConfig as config } from '@sitecore-content-sdk/nextjs/config';
import { LayoutServicePageState } from '@sitecore-content-sdk/nextjs';
import sitesList from 'temp/sites';
import { initApp } from '@sitecore-content-sdk/nextjs/config';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  initApp(sitesList);
  // Browser ClientSDK init allows for page view events to be tracked
  useEffect(() => {
    const pageState = props.layoutData?.sitecore?.context.pageState;
    const renderingType = props.layoutData?.sitecore?.context.renderingType;
    if (process.env.NODE_ENV === 'development')
      console.debug('Browser Events SDK is not initialized in development environment');
    else if (pageState !== LayoutServicePageState.Normal || renderingType === 'component')
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    else {
      CloudSDK({
        sitecoreEdgeUrl: config.api.edge.edgeUrl,
        sitecoreEdgeContextId: config.api.edge.contextId,
        siteName: props.site?.name || config.defaultSite,
        enableBrowserCookie: true,
        // Replace with the top level cookie domain of the website that is being integrated e.g ".example.com" and not "www.example.com"
        cookieDomain: window.location.hostname.replace(/^www\./, ''),
      })
        .addEvents()
        .initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.site?.name]);

  return null;
};

export default Bootstrap;
