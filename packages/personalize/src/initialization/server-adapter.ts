import {
  createCookieString,
  getCookieServerSide,
} from '@sitecore-content-sdk/analytics-core/utils';
import { PersonalizeAdapter } from './types';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getPersonalizePlugin } from './shared';
import {
  COOKIE_NAME_PREFIX,
  getDefaultCookieAttributes,
} from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { fetchGuestIdFromEdgeProxy } from '../guest-id/fetch-guest-id-from-edge-proxy';
import type { IncomingMessage, OutgoingMessage } from 'http';

export interface PersonalizeServerAdapter extends PersonalizeAdapter {
  type: 'server';
  getUserAgent: PersonalizeAdapter['getUserAgent'];
}

/**
 * Enables personalization in the server.
 * @template Request - The HTTP request type extending `IncomingMessage`.
 * @template Response - The HTTP response type extending `OutgoingMessage`.
 * @param {Request} request - The HTTP request object.
 * @param {Response} response - The HTTP response object.
 * @returns {PersonalizeServerAdapter} An PersonalizeServerAdapter instance.
 * @public
 */
export function personalizeServerAdapter<
  Request extends IncomingMessage,
  Response extends OutgoingMessage
>(request: Request, response: Response): PersonalizeServerAdapter {
  return {
    type: 'server',
    getUserAgent: () => request.headers['user-agent'],
    getGuestId: () => getGuestId(request),
    setGuestId: async () => {
      const coreConfig = getCoreContext().config;
      const cookieOptions = getAnalyticsPlugin().options.cookies;
      const clientIdName = cookieOptions.name;
      const personalizePlugin = getPersonalizePlugin();
      const guestIdName = personalizePlugin.options.cookies.name;
      const legacyGuestIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );

      const legacyGuestIdCookie = getCookieServerSide(
        request.headers.cookie,
        legacyGuestIdCookieName
      );

      if (legacyGuestIdCookie) {
        request.headers.cookie = request.headers.cookie?.replace(
          legacyGuestIdCookie.name,
          guestIdName
        );
        response.setHeader('Set-Cookie', [
          createCookieString(guestIdName, legacyGuestIdCookie.value, cookieAttributes),
          createCookieString(legacyGuestIdCookieName, '', {
            ...cookieAttributes,
            maxAge: 0,
          }),
        ]);

        return;
      }

      const cookiesValuesFromEdgeServer = getAnalyticsPlugin().options.proxyValues;
      const guestIdCookie = getCookieServerSide(request.headers.cookie, guestIdName);
      const clientIdCookie = getCookieServerSide(request.headers.cookie, clientIdName);

      let guestIdCookieString;

      if (guestIdCookie)
        guestIdCookieString = createCookieString(
          guestIdName,
          guestIdCookie.value,
          cookieAttributes
        );
      else if (cookiesValuesFromEdgeServer?.guestId)
        guestIdCookieString = createCookieString(
          guestIdName,
          cookiesValuesFromEdgeServer.guestId,
          cookieAttributes
        );
      else if (clientIdCookie) {
        const guestIdCookieValueFromEdgeProxy = await fetchGuestIdFromEdgeProxy(
          clientIdCookie.value,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );
        guestIdCookieString = createCookieString(
          guestIdName,
          guestIdCookieValueFromEdgeProxy,
          cookieAttributes
        );
      } else return;

      if (!guestIdCookie)
        request.headers.cookie = request.headers.cookie
          ? request.headers.cookie + '; ' + guestIdCookieString
          : guestIdCookieString;

      let cookieHeader;
      const currentSetCookieHeader = response.getHeader('Set-Cookie');

      if (currentSetCookieHeader) {
        if (Array.isArray(currentSetCookieHeader)) {
          cookieHeader = [...currentSetCookieHeader, guestIdCookieString];
        } else {
          cookieHeader = `${currentSetCookieHeader}; ${guestIdCookieString}`;
        }
      } else {
        cookieHeader = guestIdCookieString;
      }

      response.setHeader('Set-Cookie', cookieHeader);
    },
  };
}

/**
 * Retrieves the guest ID from the request cookies.
 * @template Request - The HTTP request type extending `IncomingMessage`.
 * @param {Request} request
 * @returns {string | null} The guest ID or null if not found.
 * @internal
 */
function getGuestId<Request extends IncomingMessage>(request: Request): string | null {
  return (
    getCookieServerSide(request.headers.cookie, getPersonalizePlugin().options.cookies.name)
      ?.value ?? null
  );
}
