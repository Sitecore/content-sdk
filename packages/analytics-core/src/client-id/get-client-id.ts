import { getAnalyticsPlugin } from '../internal';

/**
 * Gets the client ID from the cookie.
 * @returns {string} The client ID if the cookie exists.
 * @public
 */
export function getClientId(): string {
  return getAnalyticsPlugin().adapter.getClientId() || '';
}
