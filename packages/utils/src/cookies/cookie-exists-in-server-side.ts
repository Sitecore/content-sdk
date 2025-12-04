import { getCookieServerSide } from './get-cookie-server-side';

/**
 * Evaluates whether a specified cookie name exists in the request header
 * @param cookiesHeader - The cookie string of the request header
 * @param cookieName - The cookie name to be found
 * @returns - A boolean value if cookie exists
 */
export function cookieExistsInServerSide(cookiesHeader: string, cookieName: string): boolean {
  return getCookieServerSide(cookiesHeader, cookieName) !== undefined;
}
