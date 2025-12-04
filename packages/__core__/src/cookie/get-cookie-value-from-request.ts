import {
  getCookieServerSide,
  isHttpRequest,
  isNextJsMiddlewareRequest,
} from '@sitecore-content-sdk/utils';
import type { Request } from '@sitecore-content-sdk/utils';
import { getCookieValueFromMiddlewareRequest } from './get-cookie-value-from-middleware-request';

/**
 * Retrieves the cookie value from the provided request object ('T'), using the specified 'cookieName'.
 *
 * @param request - The request object, either a Middleware Request or an HTTP Request.
 * @param cookieName - The name of the cookie to retrieve the cookie value from.
 * @returns The cookie value extracted from the cookie or an empty string if not found.
 */
export function getCookieValueFromRequest<T extends Request>(request: T, cookieName: string) {
  let cookieValue: string | undefined = undefined;
  if (isNextJsMiddlewareRequest(request))
    cookieValue = getCookieValueFromMiddlewareRequest(request, cookieName);
  else if (isHttpRequest(request)) {
    const cookieHeader = request.headers.cookie;
    cookieValue = getCookieServerSide(cookieHeader, cookieName)?.value;
  }

  return cookieValue ?? '';
}
