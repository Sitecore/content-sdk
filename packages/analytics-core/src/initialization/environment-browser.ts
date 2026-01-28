import {
  COOKIE_NAME_PREFIX,
  fetchBrowserIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '../internal';
import { createCookieString, getCookieValueClientSide } from '../utils';
import { deleteCookie } from '../utils/cookies/delete-cookie';
import { getAnalyticsPlugin } from './plugin';
import { AnalyticsEnvironment } from './types';
import { getCoreSettings } from '@sitecore-content-sdk/core';

interface AnalyticsBrowserEnvironment extends AnalyticsEnvironment {
  type: 'browser';
}

/**
 * Enables analytics functionality in the browser environment.
 * @public
 */
export function analyticsBrowserEnvironment(): AnalyticsBrowserEnvironment {
  return {
    type: 'browser',
    getBrowserId: () => {
      return getCookieValueClientSide(getAnalyticsPlugin().settings.cookieSettings.name.browserId);
    },
    setBrowserId: async () => {
      const coreSettings = getCoreSettings().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;

      const cookieAttributes = getDefaultCookieAttributes(
        analyticsSettings.cookieSettings.expiryDays,
        analyticsSettings.cookieSettings.domain
      );

      const legacyCookie = getCookieValueClientSide(
        `${COOKIE_NAME_PREFIX}${coreSettings.contextId}`
      );

      if (legacyCookie) {
        document.cookie = createCookieString(
          analyticsSettings.cookieSettings.name.browserId,
          legacyCookie,
          cookieAttributes
        );
        deleteCookie(`${COOKIE_NAME_PREFIX}${coreSettings.contextId}`);

        return;
      }

      const cookieValues = await fetchBrowserIdFromEdgeProxy(
        coreSettings.sitecoreEdgeUrl,
        coreSettings.contextId
      );

      getAnalyticsPlugin().settings.proxyValues = cookieValues;

      document.cookie = createCookieString(
        analyticsSettings.cookieSettings.name.browserId,
        cookieValues.browserId,
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

