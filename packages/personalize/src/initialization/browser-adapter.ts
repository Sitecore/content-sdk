import {
  createCookieString,
  getCookieValueClientSide,
} from '@sitecore-content-sdk/analytics-core/utils';
import { PersonalizeAdapter } from './types';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getPersonalizePlugin } from './shared';
import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchGuestIdFromEdgeProxy } from '../guest-id/fetch-guest-id-from-edge-proxy';

export interface PersonalizeBrowserAdapter extends PersonalizeAdapter {
  type: 'browser';
}

/**
 * Enables personalize functionality in the browser environment.
 * @returns An PersonalizeBrowserAdapter instance.
 * @public
 */
export function personalizeBrowserAdapter(): PersonalizeBrowserAdapter {
  return {
    type: 'browser',
    getGuestId: () => {
      return getCookieValueClientSide(getPersonalizePlugin().options.cookies.name);
    },
    setGuestId: async () => {
      const coreConfig = getCoreContext().config;
      const analyticsOptions = getAnalyticsPlugin().options;
      const personalizePlugin = getPersonalizePlugin();
      const guestIdCookieName = personalizePlugin.options.cookies.name;
      const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;
      const cookieAttributes = getDefaultCookieAttributes(
        analyticsOptions.cookies.expiryDays,
        analyticsOptions.cookies.domain
      );

      const legacyGuestIdCookie = getCookieValueClientSide(legacyGuestIdCookieName);

      if (legacyGuestIdCookie) {
        document.cookie = createCookieString(
          guestIdCookieName,
          legacyGuestIdCookie,
          cookieAttributes
        );

        document.cookie = createCookieString(legacyGuestIdCookieName, '', {
          ...cookieAttributes,
          maxAge: 0,
        });

        return;
      }

      const cookiesValuesFromEdgeBrowser = getAnalyticsPlugin().options.proxyValues;

      const guestIdCookieValue = getCookieValueClientSide(guestIdCookieName);
      const clientIdCookieValue = getCookieValueClientSide(analyticsOptions.cookies.name);

      if (guestIdCookieValue) return;
      else if (cookiesValuesFromEdgeBrowser?.guestId)
        document.cookie = createCookieString(
          guestIdCookieName,
          cookiesValuesFromEdgeBrowser.guestId,
          cookieAttributes
        );
      else if (clientIdCookieValue) {
        const guestIdCookieValue = await fetchGuestIdFromEdgeProxy(
          clientIdCookieValue,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );

        document.cookie = createCookieString(
          guestIdCookieName,
          guestIdCookieValue,
          cookieAttributes
        );
      }
    },
  };
}
