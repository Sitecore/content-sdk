import {
  getCookiesValuesFromEdgeServer,
  getDefaultCookieAttributes,
  getGuestIdServer,
} from '@sitecore-content-sdk/analytics-core/internal';
import type { Settings } from '@sitecore-content-sdk/analytics-core/server';
import {
  createCookieString,
  getCookieServerSide,
  type HttpRequest,
  type HttpResponse,
  type Request,
  type Response,
} from '@sitecore-content-sdk/analytics-core/utils';
import type { PersonalizeSettings } from './interfaces';

/**
 * Handles personalize cookie creation for HTTP requests
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @param {PersonalizeSettings} settings - Personalize package settings
 * @param {Settings} cloudSDKSettings - Cloud SDK settings
 * @returns {Promise<void>} Promise that resolves when cookie is created
 */
export async function handleHttpCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void> {
  const httpRequest = request as HttpRequest;
  const httpResponse = response as HttpResponse;

  const cookiesValuesFromEdgeServer = getCookiesValuesFromEdgeServer();

  const guestIdCookie = getCookieServerSide(
    httpRequest.headers.cookie,
    settings.cookieSettings.name.guestId
  );
  const browserIdCookie = getCookieServerSide(
    httpRequest.headers.cookie,
    cloudSDKSettings.cookieSettings.name.browserId
  );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    cloudSDKSettings.cookieSettings.expiryDays,
    cloudSDKSettings.cookieSettings.domain
  );

  let guestIdCookieString;

  if (guestIdCookie)
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      guestIdCookie.value,
      defaultCookieAttributes
    );
  else if (cookiesValuesFromEdgeServer?.guestId)
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      cookiesValuesFromEdgeServer.guestId,
      defaultCookieAttributes
    );
  else if (browserIdCookie) {
    const guestIdCookieValueFromEdgeProxy = await getGuestIdServer(browserIdCookie.value);
    guestIdCookieString = createCookieString(
      settings.cookieSettings.name.guestId,
      guestIdCookieValueFromEdgeProxy,
      defaultCookieAttributes
    );
  } else return;

  if (!guestIdCookie)
    httpRequest.headers.cookie = httpRequest.headers.cookie
      ? httpRequest.headers.cookie + '; ' + guestIdCookieString
      : guestIdCookieString;

  httpResponse.setHeader('Set-Cookie', guestIdCookieString);
}
