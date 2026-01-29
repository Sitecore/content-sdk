import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreSettings } from '@sitecore-content-sdk/core';
import {
  fetchGuestIdFromEdgeProxy,
  getPersonalizePlugin,
} from '@sitecore-content-sdk/personalize/internal';
import { PersonalizeEnvironment } from '@sitecore-content-sdk/personalize/types/src/initialization/types';
import { NextRequest, NextResponse } from 'next/server';
import { getBrowserId } from './analytics';

export interface PersonalizeProxyEnvironment extends Required<PersonalizeEnvironment> {
  type: 'proxy';
}

/**
 * Enables personalize functionality in the proxy environment.
 * @param {NextRequest} request - The HTTP request object.
 * @param {NextResponse} response - The HTTP response object.
 * @public
 */
export function personalizeProxyEnvironment(
  request: NextRequest,
  response: NextResponse
): PersonalizeProxyEnvironment {
  return {
    type: 'proxy',
    getUserAgent: () => request.headers.get('user-agent') || undefined,
    getGuestId: () => {
      return getGuestId(request);
    },
    setGuestId: async () => {
      const coreSettings = getCoreSettings().settings;
      const cookieSettings = getAnalyticsPlugin().settings.cookieSettings;
      const personalizePlugin = getPersonalizePlugin();
      const guestIdName = personalizePlugin.settings.cookieSettings.name.guestId;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );
      const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${coreSettings.contextId}_personalize`;

      const legacyGuestIdCookie = request.cookies.get(legacyGuestIdCookieName)?.value;
      if (legacyGuestIdCookie) {
        request.cookies.set(guestIdName, legacyGuestIdCookie);
        response.cookies.set(guestIdName, legacyGuestIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyGuestIdCookieName);
        response.cookies.delete(legacyGuestIdCookieName);

        return;
      }

      const cookiesValuesFromEdgeServer = getAnalyticsPlugin().settings.proxyValues;

      const guestIdCookie = getGuestId(request);
      const browserIdCookie = getBrowserId(request);

      let newGuestIdCookieValue;
      if (guestIdCookie) newGuestIdCookieValue = guestIdCookie;
      else if (cookiesValuesFromEdgeServer?.guestId)
        newGuestIdCookieValue = cookiesValuesFromEdgeServer.guestId;
      else if (browserIdCookie) {
        const guestIdCookieValueFromEdgeProxy = await fetchGuestIdFromEdgeProxy(
          browserIdCookie,
          coreSettings.contextId,
          coreSettings.sitecoreEdgeUrl
        );
        newGuestIdCookieValue = guestIdCookieValueFromEdgeProxy;
      } else return;

      if (!guestIdCookie) request.cookies.set(guestIdName, newGuestIdCookieValue);

      const attributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      response.cookies.set(guestIdName, newGuestIdCookieValue, {
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
  const guestIdName = getPersonalizePlugin().settings.cookieSettings.name.guestId;

  return request.cookies.get(guestIdName)?.value || null;
}

