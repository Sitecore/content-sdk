import {
  COOKIE_NAME_PREFIX,
  fetchBrowserIdFromEdgeProxy,
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
    getBrowserId: () => {
      return getBrowserId(request);
    },
    setBrowserId: async () => {
      const coreSettings = getCoreSettings().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;
      const cookieSettings = analyticsSettings.cookieSettings;
      const browserIdName = cookieSettings.name.browserId;
      const legacyBrowserIdName = `${COOKIE_NAME_PREFIX}${coreSettings.contextId}`;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      const legacyBrowserIdCookie = request.cookies.get(legacyBrowserIdName)?.value;
      if (legacyBrowserIdCookie) {
        request.cookies.set(browserIdName, legacyBrowserIdCookie);
        response.cookies.set(browserIdName, legacyBrowserIdCookie, {
          ...cookieAttributes,
          sameSite: 'none',
        });

        request.cookies.delete(legacyBrowserIdName);
        response.cookies.delete(legacyBrowserIdName);

        return;
      }

      const browserIdCookie = getBrowserId(request);

      let newBrowserIdCookieValue;
      if (!browserIdCookie) {
        const cookieValues = await fetchBrowserIdFromEdgeProxy(
          coreSettings.sitecoreEdgeUrl,
          coreSettings.contextId,
          analyticsSettings.timeout
        );

        newBrowserIdCookieValue = cookieValues.browserId;
        getAnalyticsPlugin().settings.proxyValues = cookieValues;
      } else newBrowserIdCookieValue = browserIdCookie;

      if (!browserIdCookie) request.cookies.set(browserIdName, newBrowserIdCookieValue);

      const attributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      response.cookies.set(browserIdName, newBrowserIdCookieValue, {
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
 * Retrieves the browser ID from the request cookies.
 * @param {NextRequest} request
 * @returns {string | null} The browser ID or null if not found.
 * @internal
 */
export const getBrowserId = (request: NextRequest): string | null => {
  const browserIdName = getAnalyticsPlugin().settings.cookieSettings.name.browserId;

  return request.cookies.get(browserIdName)?.value || null;
};

