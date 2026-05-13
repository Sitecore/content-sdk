import { DAILY_SECONDS, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import type { CookieProperties } from '../utils';

/**
 * Gets the default cookie attributes.
 * @param {number} [maxAge] - Sets the cookie "Max-Age" attribute in days.
 * @param {string} [cookieDomain] - Optional domain for the cookie.
 * @returns {CookieProperties} The default configuration settings for the cookie string.
 * @internal
 */
export function getDefaultCookieAttributes(
  maxAge: number = DEFAULT_COOKIE_EXPIRY_DAYS,
  cookieDomain?: string
): CookieProperties {
  return {
    domain: cookieDomain,
    maxAge: maxAge * DAILY_SECONDS,
    path: '/',
    sameSite: 'None',
    secure: true,
  };
}
