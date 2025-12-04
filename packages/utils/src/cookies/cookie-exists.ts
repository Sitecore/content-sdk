/**
 * Checks if the cookie exists in the cookie string
 * @param cookieStr - The cookie string containing every cookie
 * @param cookieName - The cookie name to be found
 * @returns - boolean value, if the cookie is found in the cookie string
 */
export function cookieExists(cookieStr: string, cookieName: string): boolean {
  return cookieStr.split('; ').some((cookie: string) => cookie.split('=')[0] === cookieName);
}
