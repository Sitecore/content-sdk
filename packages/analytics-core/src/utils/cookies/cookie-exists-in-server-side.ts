import { getCookieServerSide } from './get-cookie-server-side';

/**
 * Checks whether a cookie exists in a server-side request header string.
 * @param {string} cookiesHeader Raw `cookie` header contents.
 * @param {string} cookieName The cookie name to search for.
 * @returns {boolean} True when the cookie is present.
 * @internal
 */
export function cookieExistsInServerSide(cookiesHeader: string, cookieName: string): boolean {
  return getCookieServerSide(cookiesHeader, cookieName) !== undefined;
}
