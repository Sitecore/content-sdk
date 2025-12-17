import { useEffect, JSX } from 'react';

import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import {
  createBrowserEnvironment,
  initSitecore,
  updateEnvironment,
} from '@sitecore-content-sdk/core';
import { eventsPluginBrowser, updateEventsSettings } from '@sitecore-content-sdk/events/plugin';
import '@sitecore-cloudsdk/events/browser';
import config from 'sitecore.config';

/**
 * The Bootstrap component is the entry point for performing any initialization logic
 * that needs to happen early in the application's lifecycle.
 * @param props
 */
const Bootstrap = (props: SitecorePageProps): JSX.Element | null => {
  const { page } = props;

  initSitecore({
    config: {
      sitecoreEdgeUrl: config.api.edge.edgeUrl,
      sitecoreContextId: config.api.edge.clientContextId,
    },
    plugins: [eventsPluginBrowser({ enabled: false })],
  });

  // Browser ClientSDK init allows for page view events to be tracked

  useEffect(() => {
    updateEnvironment(createBrowserEnvironment(), { triggerDeferredInit: true });

    if (!page) {
      return;
    }

    const mode = page.mode;
    if (process.env.NODE_ENV === 'development') {
      console.debug('Browser Events SDK is not initialized in development environment');
    } else if (!mode.isNormal) {
      console.debug('Browser Events SDK is not initialized in edit and preview modes');
    } else {
      // check if cookie is enabled
      if (true) updateEventsSettings({ enabled: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.siteName]);

  return null;
};

export default Bootstrap;
