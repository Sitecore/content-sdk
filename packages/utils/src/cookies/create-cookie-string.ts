import type { CookieProperties } from './interfaces';

/**
 * Creates the cookie string with the respectively cookie attributes
 * @param name - name of the cookie
 * @param value - value of the cookie
 * @param attributes - an object of supported cookie attributes
 * @returns - a string that will be passed to document.cookie
 */
export function createCookieString(
  name: string,
  value: string,
  attributes: CookieProperties
): string {
  let cookieString = `${name}=${value};`;

  cookieString += ` Max-Age=${attributes.maxAge}; SameSite=${attributes.sameSite};`;
  cookieString += attributes.secure ? ' Secure;' : '';
  cookieString += attributes.path ? ` Path=${attributes.path};` : '';
  cookieString += attributes.domain ? ` Domain=${attributes.domain};` : '';

  cookieString = cookieString.substring(0, cookieString.length - 1);

  return cookieString;
}
