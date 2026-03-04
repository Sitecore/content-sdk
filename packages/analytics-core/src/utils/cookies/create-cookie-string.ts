import type { CookieProperties } from './interfaces';

/**
 * Creates a cookie string with the provided attributes.
 * @param {string} name Cookie name.
 * @param {string} value Cookie value.
 * @param {CookieProperties} attributes Supported cookie attributes.
 * @returns {string} Serialized cookie ready to be assigned to `document.cookie`.
 * @internal
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
