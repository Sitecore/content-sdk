import { useEffect, JSX } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';
import {
  LayoutServicePageState,
  SitecorePageProps,
  RenderingType,
} from '@sitecore-content-sdk/nextjs';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  // Browser ClientSDK init allows for page view events to be tracked
  useEffect(() => {
    const pageState = props.layout?.sitecore?.context.pageState;
    const renderingType = props.layout?.sitecore?.context.renderingType;
    if (process.env.NODE_ENV === 'development')
      console.debug('Browser Events SDK is not initialized in development environment');
    else if (
      pageState !== LayoutServicePageState.Normal ||
      renderingType === RenderingType.Component
    )
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    else {
      if (config.api.edge?.clientContextId) {
        CloudSDK({
          sitecoreEdgeUrl: config.api.edge.edgeUrl,
          sitecoreEdgeContextId: config.api.edge.clientContextId,
          siteName: props.site?.name || config.defaultSite,
          enableBrowserCookie: true,
          // Replace with the top level cookie domain of the website that is being integrated e.g ".example.com" and not "www.example.com"
          cookieDomain: window.location.hostname.replace(/^www\./, ''),
        })
          .addEvents()
          .initialize();
      } else {
        console.error('Client Edge API settings missing from configuration');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.site?.name]);

  return null;
};

export default Bootstrap;
