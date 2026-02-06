import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import {
  fetchGuestIdFromEdgeProxy,
  getPersonalizePlugin,
} from '@sitecore-content-sdk/personalize/internal';
import { PersonalizeAdapter } from '@sitecore-content-sdk/personalize/internal';
import { NextRequest, NextResponse } from 'next/server';
import { getClientId } from './analytics-adapter';

export interface PersonalizeProxyAdapter extends Required<PersonalizeAdapter> {
  type: 'proxy';
}

/**
 * Enables personalize functionality in the proxy environment.
 * @param {NextRequest} request - The HTTP request object.
 * @param {NextResponse} response - The HTTP response object.
 * @public
 */
export function personalizeProxyAdapter(
  request: NextRequest,
  response: NextResponse
): PersonalizeProxyAdapter {
  return {
    type: 'proxy',
    getUserAgent: () => request.headers.get('user-agent') || undefined,
    getGuestId: () => {
      return getGuestId(request);
    },
    setGuestId: async () => {
      const coreConfig = getCoreContext().config;
      const cookieOptions = getAnalyticsPlugin().options.cookies;
      const personalizePlugin = getPersonalizePlugin();
      const guestIdCookieName = personalizePlugin.options.cookies.name;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );
      const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;

      const legacyGuestIdCookie = request.cookies.get(legacyGuestIdCookieName)?.value;
      if (legacyGuestIdCookie) {
        request.cookies.set(guestIdCookieName, legacyGuestIdCookie);
        response.cookies.set(guestIdCookieName, legacyGuestIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyGuestIdCookieName);
        response.cookies.delete(legacyGuestIdCookieName);

        return;
      }

      const cookiesValuesFromEdgeServer = getAnalyticsPlugin().options.proxyValues;

      const guestIdCookie = getGuestId(request);
      const clientIdCookie = getClientId(request);

      let newGuestIdCookieValue;
      if (guestIdCookie) newGuestIdCookieValue = guestIdCookie;
      else if (cookiesValuesFromEdgeServer?.guestId)
        newGuestIdCookieValue = cookiesValuesFromEdgeServer.guestId;
      else if (clientIdCookie) {
        const guestIdCookieValueFromEdgeProxy = await fetchGuestIdFromEdgeProxy(
          clientIdCookie,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );
        newGuestIdCookieValue = guestIdCookieValueFromEdgeProxy;
      } else return;

      if (!guestIdCookie) request.cookies.set(guestIdCookieName, newGuestIdCookieValue);

      const attributes = getDefaultCookieAttributes(cookieOptions.expiryDays, cookieOptions.domain);

      response.cookies.set(guestIdCookieName, newGuestIdCookieValue, {
        ...attributes,
        sameSite: 'none',
      });
    },
  };
}

/**
 * Retrieves the guest ID from the request cookies.
 * @param {NextRequest} request
 * @returns {string | null} The guest ID or null if not found.
 * @internal
 */
function getGuestId(request: NextRequest): string | null {
  const guestIdCookieName = getPersonalizePlugin().options.cookies.name;

  return request.cookies.get(guestIdCookieName)?.value || null;
}
