import { getCookie } from './get-cookie';

/**
 * Gets the value for a given cookie name
 * @param cookieName - The cookie name to be found
 * @returns - The value of the cookie if it exists or empty string
 */
export function getCookieValueClientSide(cookieName: string): string {
  const cookie = getCookie(document.cookie, cookieName);

  return cookie?.value ?? '';
}
