import type { Cookie, MiddlewareRequest } from '@sitecore-content-sdk/utils';

/**
 * Extracts the cookie value from the provided middleware request by reading the
 * given `cookieName`. The function first checks for Next.js v12 cookie values,
 * and if not found, it checks for Next.js v13 cookie values.
 * @param {MiddlewareRequest} request - The middleware request object.
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {string | undefined} The cookie value extracted from the cookie, or undefined if not found.
 */
export function getCookieValueFromMiddlewareRequest(
  request: MiddlewareRequest,
  cookieName: string
): string | undefined {
  const cookieValueFromRequest: Cookie | string | undefined = request.cookies.get(cookieName);
  // It checks nextjs v12 cookie values
  if (typeof cookieValueFromRequest === 'string') return cookieValueFromRequest;
  // It checks nextjs v13 cookie values
  if (typeof cookieValueFromRequest === 'object') return cookieValueFromRequest.value;

  return undefined;
}
