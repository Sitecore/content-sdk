import {
  COOKIE_NAME_PREFIX,
  fetchBrowserIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '../internal';
import { createCookieString, getCookieServerSide } from '../utils';
import { getAnalyticsPlugin } from './plugin';
import { AnalyticsEnvironment } from './types';
import { getCoreSettings } from '@sitecore-content-sdk/core';
import type { IncomingMessage, OutgoingMessage } from 'http';

interface AnalyticsServerEnvironment extends AnalyticsEnvironment {
  type: 'server';
}

/**
 * Enables analytics functionality in the server environment.
 * @param {IncomingMessage} request - The HTTP request object.
 * @param {OutgoingMessage} response - The HTTP response object.
 * @public
 */
export function analyticsServerEnvironment(
  request: IncomingMessage,
  response: OutgoingMessage
): AnalyticsServerEnvironment {
  return {
    type: 'server',
    getBrowserId: () => {
      return getBrowserId(request);
    },
    setBrowserId: async () => {
      const coreSettings = getCoreSettings().settings;
      const analyticsSettings = getAnalyticsPlugin().settings;
      const cookieSettings = analyticsSettings.cookieSettings;
      const browserIdName = cookieSettings.name.browserId;
      const legacyBrowserIdName = `${COOKIE_NAME_PREFIX}${coreSettings.contextId}`;
      const defaultCookieAttributes = getDefaultCookieAttributes(
        cookieSettings.expiryDays,
        cookieSettings.domain
      );

      const legacyBrowserIdCookie = getCookieServerSide(
        request.headers.cookie,
        legacyBrowserIdName
      );

      if (legacyBrowserIdCookie) {
        request.headers.cookie = request.headers.cookie?.replace(
          legacyBrowserIdCookie.name,
          browserIdName
        );
        response.setHeader('Set-Cookie', [
          createCookieString(browserIdName, legacyBrowserIdCookie.value, defaultCookieAttributes),
          createCookieString(legacyBrowserIdName, '', { ...defaultCookieAttributes, maxAge: 0 }),
        ]);
        return;
      }

      const browserIdCookie = getBrowserId(request);
      let browserIdCookieValue;

      if (!browserIdCookie) {
        const cookieValues = await fetchBrowserIdFromEdgeProxy(
          coreSettings.sitecoreEdgeUrl,
          coreSettings.contextId,
          analyticsSettings.timeout
        );

        browserIdCookieValue = cookieValues.browserId;
        getAnalyticsPlugin().settings.proxyValues = cookieValues;
      } else browserIdCookieValue = browserIdCookie;

      const browserIdCookieString = createCookieString(
        browserIdName,
        browserIdCookieValue,
        defaultCookieAttributes
      );

      if (!browserIdCookie) {
        request.headers.cookie = request.headers.cookie
          ? request.headers.cookie + '; ' + browserIdCookieString
          : browserIdCookieString;
      }

      let cookieHeader;
      const currentSetCookieHeader = response.getHeader('Set-Cookie');

      if (currentSetCookieHeader) {
        if (Array.isArray(currentSetCookieHeader)) {
          cookieHeader = [...currentSetCookieHeader, browserIdCookieString];
        } else {
          cookieHeader = `${currentSetCookieHeader}; ${browserIdCookieString}`;
        }
      } else {
        cookieHeader = browserIdCookieString;
      }

      response.setHeader('Set-Cookie', cookieHeader);
    },
    location: {
      getSearchParams: () => {
        // Host is irrelevant but necessary to support relative URL
        const requestUrl = new URL(request.url as string, `https://localhost`);

        return requestUrl.search;
      },
    },
  };
}

/**
 * Retrieves the browser ID from the request cookies.
 * @param {IncomingMessage} request
 * @returns {string | null} The browser ID or null if not found.
 * @internal
 */
function getBrowserId(request: IncomingMessage): string | null {
  return (
    getCookieServerSide(
      request.headers.cookie,
      getAnalyticsPlugin().settings.cookieSettings.name.browserId
    )?.value ?? null
  );
}
