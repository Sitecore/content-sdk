import {
  COOKIE_NAME_PREFIX,
  fetchClientIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  getAnalyticsPlugin,
  AnalyticsEnvironment,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreSettings } from '@sitecore-content-sdk/core';
import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsProxyEnvironment extends AnalyticsEnvironment {
  type: 'proxy';
}

/**
 * Enables analytics functionality in the proxy environment.
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 * @public
 */
export function analyticsProxyEnvironment(
  request: NextRequest,
  response: NextResponse
): AnalyticsProxyEnvironment {
  return {
    type: 'proxy',
    getClientId: () => {
      return getClientId(request);
    },
    setClientId: async () => {
      const coreSettings = getCoreSettings().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;
      const cookieSettings = analyticsSettings.cookieSettings;
      const clientIdName = cookieSettings.name.clientId;
      const legacyClientIdName = `${COOKIE_NAME_PREFIX}${coreSettings.contextId}`;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      const legacyClientIdCookie = request.cookies.get(legacyClientIdName)?.value;
      if (legacyClientIdCookie) {
        request.cookies.set(clientIdName, legacyClientIdCookie);
        response.cookies.set(clientIdName, legacyClientIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyClientIdName);
        response.cookies.delete(legacyClientIdName);

        return;
      }

      const clientIdCookie = getClientId(request);

      let newClientIdCookieValue;
      if (!clientIdCookie) {
        const cookieValues = await fetchClientIdFromEdgeProxy(
          coreSettings.sitecoreEdgeUrl,
          coreSettings.contextId,
          analyticsSettings.timeout
        );

        newClientIdCookieValue = cookieValues.clientId;
        getAnalyticsPlugin().settings.proxyValues = cookieValues;
      } else newClientIdCookieValue = clientIdCookie;

      if (!clientIdCookie) request.cookies.set(clientIdName, newClientIdCookieValue);
      const attributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      response.cookies.set(clientIdName, newClientIdCookieValue, {
        ...attributes,
        sameSite: 'none',
      });
    },
    location: {
      getSearchParams: () => {
        return request.nextUrl.searchParams.toString();
      },
    },
  };
}

/**
 * Retrieves the client ID from the request cookies.
 * @param {NextRequest} request
 * @returns {string | null} The client ID or null if not found.
 * @internal
 */
export const getClientId = (request: NextRequest): string | null => {
  const clientIdName = getAnalyticsPlugin().settings.cookieSettings.name.clientId;

  return request.cookies.get(clientIdName)?.value || null;
};
