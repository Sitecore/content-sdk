/**
 * Retrieves the cookie, if it exists in the cookie string
 * @param cookieStr - The cookie string containing every cookie
 * @param cookieName - The cookie name to be found
 * @returns - an object that contains the cookie name and value or undefined, if not found
 */
export function getCookie(
  cookieStr: string | undefined,
  cookieName: string
): { name: string; value: string } | undefined {
  if (!cookieStr) return undefined;

  const found = cookieStr.split('; ').find((cookie: string) => {
    return cookie.indexOf('=') > 0 && cookie.split('=')[0] === cookieName;
  });

  return found !== undefined
    ? { name: found.split('=')[0], value: found.split('=')[1] }
    : undefined;
}
