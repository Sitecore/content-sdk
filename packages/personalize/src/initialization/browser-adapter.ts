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
import { fetchProfileIdFromEdgeProxy } from '../profile-id/fetch-profile-id-from-edge-proxy';

/**
 * Defines the PersonalizeBrowserAdapter.
 * @public
 */
export interface PersonalizeBrowserAdapter extends PersonalizeAdapter {
  /**
   * The type of the adapter.
   */
  type: 'browser';
}

/**
 * Creates a browser-based personalize adapter that reads and writes the profile ID
 * using cookies and can resolve a new profile ID from the Edge proxy when needed.
 * @returns {PersonalizeBrowserAdapter} An PersonalizeBrowserAdapter instance.
 * @public
 */
export function personalizeBrowserAdapter(): PersonalizeBrowserAdapter {
  return {
    type: 'browser',
    getProfileId: () => {
      return getCookieValueClientSide(getPersonalizePlugin().options.cookies.name);
    },
    setProfileId: async () => {
      const coreConfig = getCoreContext().config;
      const analyticsOptions = getAnalyticsPlugin().options;
      const personalizePlugin = getPersonalizePlugin();
      const profileIdCookieName = personalizePlugin.options.cookies.name;
      const legacyProfileIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;
      const cookieAttributes = getDefaultCookieAttributes(
        analyticsOptions.cookies.expiryDays,
        analyticsOptions.cookies.domain
      );

      const legacyProfileIdCookie = getCookieValueClientSide(legacyProfileIdCookieName);

      if (legacyProfileIdCookie) {
        document.cookie = createCookieString(
          profileIdCookieName,
          legacyProfileIdCookie,
          cookieAttributes
        );

        document.cookie = createCookieString(legacyProfileIdCookieName, '', {
          ...cookieAttributes,
          maxAge: 0,
        });

        return;
      }

      const cookiesValuesFromEdgeBrowser = getAnalyticsPlugin().options.resolvedVisitorIds;

      const profileIdCookieValue = getCookieValueClientSide(profileIdCookieName);
      const clientIdCookieValue = getCookieValueClientSide(analyticsOptions.cookies.name);

      if (profileIdCookieValue) return;
      else if (cookiesValuesFromEdgeBrowser?.profileId)
        document.cookie = createCookieString(
          profileIdCookieName,
          cookiesValuesFromEdgeBrowser.profileId,
          cookieAttributes
        );
      else if (clientIdCookieValue) {
        const profileIdCookieValue = await fetchProfileIdFromEdgeProxy(
          clientIdCookieValue,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );

        document.cookie = createCookieString(
          profileIdCookieName,
          profileIdCookieValue,
          cookieAttributes
        );
      }
    },
  };
}
