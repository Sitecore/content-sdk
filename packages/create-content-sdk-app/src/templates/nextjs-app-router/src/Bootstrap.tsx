'use client';
import { useEffect, JSX } from 'react';
import { initContentSdk } from '@sitecore-content-sdk/nextjs';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { analyticsBrowserEnvironment, analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import config from 'sitecore.config';

const Bootstrap = ({
  siteName,
  isPreviewMode,
}: {
  siteName: string;
  isPreviewMode: boolean;
}): JSX.Element | null => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Browser Events SDK is not initialized in development environment');
      return;
    }

    if (isPreviewMode) {
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
      return;
    }

    if (config.api.edge?.clientContextId) {
      console.log('✨ Initializing CloudSDK for site:', siteName);
      initContentSdk({
        settings: {
          contextId: config.api.edge.clientContextId,
          edgeUrl: config.api.edge.edgeUrl,
          siteName: siteName || config.defaultSite,
        },
        plugins: [
          analyticsPlugin({
            settings: {
              enableCookie: true,
              cookieDomain: window.location.hostname.replace(/^www\./, ''),
            },
            environment: analyticsBrowserEnvironment(),
          }),
          eventsPlugin(),
        ],
      });
    } else {
      console.error('Client Edge API settings missing from configuration');
    }
  }, [siteName, isPreviewMode]);

  return null;
};

export default Bootstrap;
