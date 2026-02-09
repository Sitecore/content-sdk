import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import {
  fetchProfileIdFromEdgeProxy,
  getPersonalizePlugin,
} from '@sitecore-content-sdk/personalize/internal';
import { PersonalizeAdapter } from '@sitecore-content-sdk/personalize/internal';
import { NextRequest, NextResponse } from 'next/server';
import { getClientId } from './analytics-adapter';

/**
 * Defines the PersonalizeProxyAdapter.
 * @public
 */
export interface PersonalizeProxyAdapter extends Required<PersonalizeAdapter> {
  /**
   * The type of the adapter.
   */
  type: 'proxy';
}

/**
 * Enables personalization in the proxy environment.
 * @param {NextRequest} request - The HTTP request object.
 * @param {NextResponse} response - The HTTP response object.
 * @returns {PersonalizeProxyAdapter} The personalize proxy adapter.
 * @public
 */
export function personalizeProxyAdapter(
  request: NextRequest,
  response: NextResponse
): PersonalizeProxyAdapter {
  return {
    type: 'proxy',
    getUserAgent: () => request.headers.get('user-agent') || undefined,
    getProfileId: () => {
      return getProfileId(request);
    },
    setProfileId: async () => {
      const coreConfig = getCoreContext().config;
      const cookieOptions = getAnalyticsPlugin().options.cookies;
      const personalizePlugin = getPersonalizePlugin();
      const profileIdCookieName = personalizePlugin.options.cookies.name;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );
      const legacyProfileIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;

      const legacyProfileIdCookie = request.cookies.get(legacyProfileIdCookieName)?.value;
      if (legacyProfileIdCookie) {
        request.cookies.set(profileIdCookieName, legacyProfileIdCookie);
        response.cookies.set(profileIdCookieName, legacyProfileIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyProfileIdCookieName);
        response.cookies.delete(legacyProfileIdCookieName);

        return;
      }

      const cookiesValuesFromEdgeServer = getAnalyticsPlugin().options.resolvedVisitorIds;

      const profileIdCookie = getProfileId(request);
      const clientIdCookie = getClientId(request);

      let newProfileIdCookieValue;
      if (profileIdCookie) newProfileIdCookieValue = profileIdCookie;
      else if (cookiesValuesFromEdgeServer?.profileId)
        newProfileIdCookieValue = cookiesValuesFromEdgeServer.profileId;
      else if (clientIdCookie) {
        const profileIdCookieValueFromEdgeProxy = await fetchProfileIdFromEdgeProxy(
          clientIdCookie,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );
        newProfileIdCookieValue = profileIdCookieValueFromEdgeProxy;
      } else return;

      if (!profileIdCookie) request.cookies.set(profileIdCookieName, newProfileIdCookieValue);

      const attributes = getDefaultCookieAttributes(cookieOptions.expiryDays, cookieOptions.domain);

      response.cookies.set(profileIdCookieName, newProfileIdCookieValue, {
        ...attributes,
        sameSite: 'none',
      });
    },
  };
}

/**
 * Retrieves the profile ID from request cookies.
 * @param {NextRequest} request
 * @returns {string | null} The profile ID or null if not found.
 * @internal
 */
function getProfileId(request: NextRequest): string | null {
  const profileIdCookieName = getPersonalizePlugin().options.cookies.name;

  return request.cookies.get(profileIdCookieName)?.value || null;
}
