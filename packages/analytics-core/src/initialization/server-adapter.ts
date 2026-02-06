import {
  COOKIE_NAME_PREFIX,
  fetchClientIdFromEdgeProxy,
  getDefaultCookieAttributes,
} from '../internal';
import { createCookieString, getCookieServerSide } from '../utils';
import { getAnalyticsPlugin } from './plugin';
import { AnalyticsAdapter } from './types';
import { getCoreContext } from '@sitecore-content-sdk/core';
import type { IncomingMessage, OutgoingMessage } from 'http';

interface AnalyticsServerAdapter extends AnalyticsAdapter {
  type: 'server';
}

/**
 * Enables analytics in the server.
 * @template Request - The HTTP request type extending `IncomingMessage`.
 * @template Response - The HTTP response type extending `OutgoingMessage`.
 * @param {Request} request - The HTTP request object.
 * @param {Response} response - The HTTP response object.
 * @returns {AnalyticsServerAdapter} The analytics server adapter.
 * @public
 */
export function analyticsServerAdapter<
  Request extends IncomingMessage,
  Response extends OutgoingMessage
>(request: Request, response: Response): AnalyticsServerAdapter {
  return {
    type: 'server',
    getClientId: () => {
      return getClientId(request);
    },
    setClientId: async () => {
      const coreConfig = getCoreContext().config;
      const analyticsOptions = getAnalyticsPlugin().options;
      const cookieOptions = analyticsOptions.cookies;
      const clientIdName = cookieOptions.name;
      const legacyClientIdName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}`;
      const defaultCookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );

      const legacyClientIdCookie = getCookieServerSide(request.headers.cookie, legacyClientIdName);

      if (legacyClientIdCookie) {
        request.headers.cookie = request.headers.cookie?.replace(
          legacyClientIdCookie.name,
          clientIdName
        );
        response.setHeader('Set-Cookie', [
          createCookieString(clientIdName, legacyClientIdCookie.value, defaultCookieAttributes),
          createCookieString(legacyClientIdName, '', { ...defaultCookieAttributes, maxAge: 0 }),
        ]);
        return;
      }

      const clientIdCookie = getClientId(request);
      let clientIdCookieValue;

      if (!clientIdCookie) {
        const cookieValues = await fetchClientIdFromEdgeProxy(
          coreConfig.edgeUrl,
          coreConfig.contextId,
          analyticsOptions.timeout
        );

        clientIdCookieValue = cookieValues.clientId;
        analyticsOptions.proxyValues = cookieValues;
      } else clientIdCookieValue = clientIdCookie;

      const clientIdCookieString = createCookieString(
        clientIdName,
        clientIdCookieValue,
        defaultCookieAttributes
      );

      if (!clientIdCookie) {
        request.headers.cookie = request.headers.cookie
          ? request.headers.cookie + '; ' + clientIdCookieString
          : clientIdCookieString;
      }

      let cookieHeader;
      const currentSetCookieHeader = response.getHeader('Set-Cookie');

      if (currentSetCookieHeader) {
        if (Array.isArray(currentSetCookieHeader)) {
          cookieHeader = [...currentSetCookieHeader, clientIdCookieString];
        } else {
          cookieHeader = `${currentSetCookieHeader}; ${clientIdCookieString}`;
        }
      } else {
        cookieHeader = clientIdCookieString;
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
 * Retrieves the client ID from the request cookies.
 * @template Request - The HTTP request type extending `IncomingMessage`.
 * @param {Request} request
 * @returns {string | null} The client ID or null if not found.
 * @internal
 */
function getClientId<Request extends IncomingMessage>(request: Request): string | null {
  return (
    getCookieServerSide(request.headers.cookie, getAnalyticsPlugin().options.cookies.name)?.value ??
    null
  );
}
