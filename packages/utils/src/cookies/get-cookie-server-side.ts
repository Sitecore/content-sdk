import { getCookie } from './get-cookie';

/**
 * Retrieves a cookie from the server-side request header string.
 * @param {string | undefined} cookiesHeader Raw `cookie` header contents.
 * @param {string} cookieName The cookie name to look up.
 * @returns {{ name: string; value: string } | undefined} The resolved cookie information when found.
 */
export function getCookieServerSide(
  cookiesHeader: string | undefined,
  cookieName: string
): { name: string; value: string } | undefined {
  return getCookie(cookiesHeader, cookieName);
}
