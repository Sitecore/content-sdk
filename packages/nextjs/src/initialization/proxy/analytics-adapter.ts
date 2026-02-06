import {
  COOKIE_NAME_PREFIX,
  fetchClientIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import {
  getAnalyticsPlugin,
  AnalyticsAdapter,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsProxyAdapter extends AnalyticsAdapter {
  type: 'proxy';
}

/**
 * Enables analytics in the proxy environment.
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 * @returns {AnalyticsProxyAdapter} The analytics proxy adapter.
 * @public
 */
export function analyticsProxyAdapter(
  request: NextRequest,
  response: NextResponse
): AnalyticsProxyAdapter {
  return {
    type: 'proxy',
    getClientId: () => {
      return getClientId(request);
    },
    setClientId: async () => {
      const coreConfig = getCoreContext().config;
      const analyticsOptions = getAnalyticsPlugin().options;
      const cookieOptions = analyticsOptions.cookies;
      const clientIdCookieName = cookieOptions.name;
      const legacyClientIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}`;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );

      const legacyClientIdCookie = request.cookies.get(legacyClientIdCookieName)?.value;
      if (legacyClientIdCookie) {
        request.cookies.set(clientIdCookieName, legacyClientIdCookie);
        response.cookies.set(clientIdCookieName, legacyClientIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyClientIdCookieName);
        response.cookies.delete(legacyClientIdCookieName);

        return;
      }

      const clientIdCookie = getClientId(request);

      let newClientIdCookieValue;
      if (!clientIdCookie) {
        const cookieValues = await fetchClientIdFromEdgeProxy(
          coreConfig.edgeUrl,
          coreConfig.contextId,
          analyticsOptions.timeout
        );

        newClientIdCookieValue = cookieValues.clientId;
        analyticsOptions.proxyValues = cookieValues;
      } else newClientIdCookieValue = clientIdCookie;

      if (!clientIdCookie) request.cookies.set(clientIdCookieName, newClientIdCookieValue);
      const attributes = getDefaultCookieAttributes(cookieOptions.expiryDays, cookieOptions.domain);

      response.cookies.set(clientIdCookieName, newClientIdCookieValue, {
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
  const clientIdCookieName = getAnalyticsPlugin().options.cookies.name;

  return request.cookies.get(clientIdCookieName)?.value || null;
};
