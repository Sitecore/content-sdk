import { getAnalyticsPlugin } from '../internal';

/**
 * Gets the browser ID from the cookie.
 * @returns {string} The browser ID if the cookie exists.
 */
export function getBrowserId(): string {
  return getAnalyticsPlugin().environment.getBrowserId() || '';
}
