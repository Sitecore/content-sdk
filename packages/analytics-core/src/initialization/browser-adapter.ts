import {
  COOKIE_NAME_PREFIX,
  fetchClientIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '../internal';
import { createCookieString, getCookieValueClientSide } from '../utils';
import { deleteCookie } from '../utils/cookies/delete-cookie';
import { getAnalyticsPlugin } from './plugin';
import { AnalyticsAdapter } from './types';
import { getCoreContext } from '@sitecore-content-sdk/core';

interface AnalyticsBrowserAdapter extends AnalyticsAdapter {
  type: 'browser';
}

/**
 * Enables analytics in the browser.
 * @returns {AnalyticsBrowserAdapter} The analytics browser adapter.
 * @public
 */
export function analyticsBrowserAdapter(): AnalyticsBrowserAdapter {
  return {
    type: 'browser',
    getClientId: () => {
      return getCookieValueClientSide(getAnalyticsPlugin().options.cookies.name);
    },
    setClientId: async () => {
      const coreConfig = getCoreContext().config;
      const analyticsOptions = getAnalyticsPlugin().options;

      const cookieAttributes = getDefaultCookieAttributes(
        analyticsOptions.cookies.expiryDays,
        analyticsOptions.cookies.domain
      );

      const legacyCookie = getCookieValueClientSide(`${COOKIE_NAME_PREFIX}${coreConfig.contextId}`);

      if (legacyCookie) {
        document.cookie = createCookieString(
          analyticsOptions.cookies.name,
          legacyCookie,
          cookieAttributes
        );
        deleteCookie(`${COOKIE_NAME_PREFIX}${coreConfig.contextId}`);
        return;
      }

      const cookieValues = await fetchClientIdFromEdgeProxy(
        coreConfig.edgeUrl,
        coreConfig.contextId
      );

      analyticsOptions.proxyValues = cookieValues;
      document.cookie = createCookieString(
        analyticsOptions.cookies.name,
        cookieValues.clientId,
        cookieAttributes
      );
    },
    location: {
      getSearchParams: () => {
        return window.location.search;
      },
    },
  };
}
