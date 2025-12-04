import { getCookie } from './get-cookie';

/**
 * Retrieves the cookie name and value from the request header
 * @param cookiesHeader - The cookie string of the request header
 * @param cookieName - The cookie name to be found
 * @returns - The name and value of the cookie, or undefined
 */
export function getCookieServerSide(
  cookiesHeader: string | undefined,
  cookieName: string
): { name: string; value: string } | undefined {
  return getCookie(cookiesHeader, cookieName);
}
