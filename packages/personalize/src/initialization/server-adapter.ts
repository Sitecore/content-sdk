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

const getGuestId = (request: IncomingMessage): string | null => {
  return (
    getCookieServerSide(request.headers.cookie, getPersonalizePlugin().options.cookies.name)
      ?.value ?? null
  );
};

/**
 * Enables personalize functionality in the server environment.
 * @param {IncomingMessage} request - The HTTP request object.
 * @param {OutgoingMessage} response - The HTTP response object.
 * @returns An PersonalizeServerAdapter instance.
 * @public
 */
export function personalizeServerAdapter(
  request: IncomingMessage,
  response: OutgoingMessage
): PersonalizeServerAdapter {
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
