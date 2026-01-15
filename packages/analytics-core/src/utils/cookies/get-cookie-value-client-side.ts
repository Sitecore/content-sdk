import { getCookie } from './get-cookie';

/**
 * Retrieves the value of a cookie in the browser context.
 * @param {string} cookieName The name of the cookie to read.
 * @returns {string} The cookie value or an empty string when not found.
 */
export function getCookieValueClientSide(cookieName: string): string {
  const cookie = getCookie(document.cookie, cookieName);

  return cookie?.value ?? '';
}
