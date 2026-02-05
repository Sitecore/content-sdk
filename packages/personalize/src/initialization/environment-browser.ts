import {
  createCookieString,
  getCookieValueClientSide,
} from '@sitecore-content-sdk/analytics-core/utils';
import { PersonalizeEnvironment } from './types';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getPersonalizePlugin } from './shared';
import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchGuestIdFromEdgeProxy } from '../guest-id/fetch-guest-id-from-edge-proxy';

export interface PersonalizeBrowserEnvironment extends PersonalizeEnvironment {
  type: 'browser';
}

/**
 * Enables personalize functionality in the browser environment.
 * @public
 */
export function personalizeBrowserEnvironment(): PersonalizeBrowserEnvironment {
  return {
    type: 'browser',
    getGuestId: () => {
      return getCookieValueClientSide(getPersonalizePlugin().settings.cookieSettings.name.guestId);
    },
    setGuestId: async () => {
      const coreContext = getCoreContext().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;
      const personalizePlugin = getPersonalizePlugin();
      const guestIdCookieName = personalizePlugin.settings.cookieSettings.name.guestId;
      const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${coreContext.contextId}_personalize`;
      const cookieAttributes = getDefaultCookieAttributes(
        analyticsSettings.cookieSettings.expiryDays,
        analyticsSettings.cookieSettings.domain
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

      const cookiesValuesFromEdgeBrowser = getAnalyticsPlugin().settings.proxyValues;

      const guestIdCookieValue = getCookieValueClientSide(guestIdCookieName);
      const clientIdCookieValue = getCookieValueClientSide(
        analyticsSettings.cookieSettings.name.clientId
      );

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
          coreContext.contextId,
          coreContext.edgeUrl
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
