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
import { fetchProfileIdFromEdgeProxy } from '../profile-id/fetch-profile-id-from-edge-proxy';
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
    getProfileId: () => getProfileId(request),
    setProfileId: async () => {
      const coreConfig = getCoreContext().config;
      const cookieOptions = getAnalyticsPlugin().options.cookies;
      const clientIdName = cookieOptions.name;
      const personalizePlugin = getPersonalizePlugin();
      const profileIdName = personalizePlugin.options.cookies.name;
      const legacyProfileIdCookieName = `${COOKIE_NAME_PREFIX}${coreConfig.contextId}_personalize`;
      const cookieAttributes = getDefaultCookieAttributes(
        cookieOptions.expiryDays,
        cookieOptions.domain
      );

      const legacyProfileIdCookie = getCookieServerSide(
        request.headers.cookie,
        legacyProfileIdCookieName
      );

      if (legacyProfileIdCookie) {
        request.headers.cookie = request.headers.cookie?.replace(
          legacyProfileIdCookie.name,
          profileIdName
        );
        response.setHeader('Set-Cookie', [
          createCookieString(profileIdName, legacyProfileIdCookie.value, cookieAttributes),
          createCookieString(legacyProfileIdCookieName, '', {
            ...cookieAttributes,
            maxAge: 0,
          }),
        ]);

        return;
      }

      const cookiesValuesFromEdgeServer = getAnalyticsPlugin().options.proxyValues;
      const profileIdCookie = getCookieServerSide(request.headers.cookie, profileIdName);
      const clientIdCookie = getCookieServerSide(request.headers.cookie, clientIdName);

      let profileIdCookieString;

      if (profileIdCookie)
        profileIdCookieString = createCookieString(
          profileIdName,
          profileIdCookie.value,
          cookieAttributes
        );
      else if (cookiesValuesFromEdgeServer?.profileId)
        profileIdCookieString = createCookieString(
          profileIdName,
          cookiesValuesFromEdgeServer.profileId,
          cookieAttributes
        );
      else if (clientIdCookie) {
        const profileIdCookieValueFromEdgeProxy = await fetchProfileIdFromEdgeProxy(
          clientIdCookie.value,
          coreConfig.contextId,
          coreConfig.edgeUrl
        );
        profileIdCookieString = createCookieString(
          profileIdName,
          profileIdCookieValueFromEdgeProxy,
          cookieAttributes
        );
      } else return;

      if (!profileIdCookie)
        request.headers.cookie = request.headers.cookie
          ? request.headers.cookie + '; ' + profileIdCookieString
          : profileIdCookieString;

      let cookieHeader;
      const currentSetCookieHeader = response.getHeader('Set-Cookie');

      if (currentSetCookieHeader) {
        if (Array.isArray(currentSetCookieHeader)) {
          cookieHeader = [...currentSetCookieHeader, profileIdCookieString];
        } else {
          cookieHeader = `${currentSetCookieHeader}; ${profileIdCookieString}`;
        }
      } else {
        cookieHeader = profileIdCookieString;
      }

      response.setHeader('Set-Cookie', cookieHeader);
    },
  };
}

/**
 * Retrieves the profile ID from the request cookies.
 * @template Request - The HTTP request type extending `IncomingMessage`.
 * @param {Request} request
 * @returns {string | null} The profile ID or null if not found.
 * @internal
 */
function getProfileId<Request extends IncomingMessage>(request: Request): string | null {
  return (
    getCookieServerSide(request.headers.cookie, getPersonalizePlugin().options.cookies.name)
      ?.value ?? null
  );
}
