/**
 * Retrieves a cookie by name from a cookie string.
 * @param {string | undefined} cookieStr Cookie string containing serialized cookies.
 * @param {string} cookieName The cookie name to locate.
 * @returns {{ name: string; value: string } | undefined} The cookie name/value pair when found.
 * @internal
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
