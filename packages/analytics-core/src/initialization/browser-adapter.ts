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
 * Enables analytics functionality in the browser environment.
 * @public
 */
export function analyticsBrowserAdapter(): AnalyticsBrowserAdapter {
  return {
    type: 'browser',
    getClientId: () => {
      return getCookieValueClientSide(getAnalyticsPlugin().settings.cookieSettings.name.clientId);
    },
    setClientId: async () => {
      const coreContext = getCoreContext().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;

      const cookieAttributes = getDefaultCookieAttributes(
        analyticsSettings.cookieSettings.expiryDays,
        analyticsSettings.cookieSettings.domain
      );

      const legacyCookie = getCookieValueClientSide(
        `${COOKIE_NAME_PREFIX}${coreContext.contextId}`
      );

      if (legacyCookie) {
        document.cookie = createCookieString(
          analyticsSettings.cookieSettings.name.clientId,
          legacyCookie,
          cookieAttributes
        );
        deleteCookie(`${COOKIE_NAME_PREFIX}${coreContext.contextId}`);

        return;
      }

      const cookieValues = await fetchClientIdFromEdgeProxy(
        coreContext.edgeUrl,
        coreContext.contextId
      );

      getAnalyticsPlugin().settings.proxyValues = cookieValues;

      document.cookie = createCookieString(
        analyticsSettings.cookieSettings.name.clientId,
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
