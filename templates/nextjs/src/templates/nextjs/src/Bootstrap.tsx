import { useEffect, JSX } from 'react';
import { SitecorePageProps, initContentSdk } from '@sitecore-content-sdk/nextjs';
import config from 'sitecore.config';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { analyticsBrowserAdapter, analyticsPlugin } from '@sitecore-content-sdk/analytics-core';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 * @param props
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  const { page } = props;

  // Browser ClientSDK init allows for page view events to be tracked

  useEffect(() => {
    if (!page) {
      return;
    }

    const mode = page.mode;
    if (process.env.NODE_ENV === 'development') {
      console.debug('Browser Events SDK is not initialized in development environment');
    } else if (!mode.isNormal) {
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    } else {
      if (config.api.edge?.clientContextId) {
        initContentSdk({
          config: {
            contextId: config.api.edge.clientContextId,
            edgeUrl: config.api.edge.edgeUrl,
            siteName: page.siteName || config.defaultSite,
          },
          plugins: [
            analyticsPlugin({
              options: {
                enableCookie: true,
                cookieDomain: window.location.hostname.replace(/^www\./, ''),
              },
              adapter: analyticsBrowserAdapter(),
            }),
            eventsPlugin(),
          ],
        });
      } else {
        console.error('Client Edge API settings missing from configuration');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.siteName]);

  return null;
};

export default Bootstrap;
