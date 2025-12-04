/**
 * Checks whether the cookie exists within a cookie string.
 * @param {string} cookieStr Cookie string containing individual cookies.
 * @param {string} cookieName The cookie name to search for.
 * @returns {boolean} True when the cookie exists in the string.
 */
export function cookieExists(cookieStr: string, cookieName: string): boolean {
  return cookieStr.split('; ').some((cookie: string) => cookie.split('=')[0] === cookieName);
}
