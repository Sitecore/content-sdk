import {
  getCookiesValuesFromEdgeServer,
  getCookieValueFromMiddlewareRequest,
  getDefaultCookieAttributes,
  getGuestIdServer,
} from '@sitecore-content-sdk/__core__/internal';
import type { Settings } from '@sitecore-content-sdk/__core__/server';
import type {
  MiddlewareNextResponse,
  MiddlewareRequest,
  Request,
  Response,
} from '@sitecore-content-sdk/utils';
import type { PersonalizeSettings } from './interfaces';

/**
 * Handles personalize cookie creation for Next.js middleware requests
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @param {PersonalizeSettings} settings - Personalize package settings
 * @param {Settings} cloudSDKSettings - Cloud SDK settings
 * @returns {Promise<void>} Promise that resolves when cookie is created
 */
export async function handleNextJsMiddlewareCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void> {
  const middlewareRequest = request as MiddlewareRequest;
  const middlewareResponse = response as MiddlewareNextResponse;

  const cookiesValuesFromEdgeServer = getCookiesValuesFromEdgeServer();

  const guestIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    settings.cookieSettings.name.guestId
  );
  const browserIdCookieValue = getCookieValueFromMiddlewareRequest(
    middlewareRequest,
    cloudSDKSettings.cookieSettings.name.browserId
  );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  let guestIdValue;

  if (guestIdCookieValue) guestIdValue = guestIdCookieValue;
  else if (cookiesValuesFromEdgeServer?.guestId) guestIdValue = cookiesValuesFromEdgeServer.guestId;
  else if (browserIdCookieValue) {
    const guestIdCookieValueFromEdgeProxy = await getGuestIdServer(browserIdCookieValue);
    guestIdValue = guestIdCookieValueFromEdgeProxy;
  } else return;

  middlewareRequest.cookies.set(
    settings.cookieSettings.name.guestId,
    guestIdValue,
    defaultCookieAttributes
  );
  middlewareResponse.cookies.set(
    settings.cookieSettings.name.guestId,
    guestIdValue,
    defaultCookieAttributes
  );
}
