import { DAILY_SECONDS, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import type { CookieProperties } from '@sitecore-content-sdk/utils';

/**
 * Gets the default Cookie Attributes
 * @param  maxAge - Set the cookie "Max-Age" attribute in days.
 * @returns the default configuration settings for the cookie string
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
