import { isbot } from 'isbot';
import { getCookie } from '@sitecore-content-sdk/analytics-core/utils';

/**
 * The cookie name for bot detection.
 * @internal
 */
export const BOT_DETECTION_COOKIE = 'sc_bot';

/**
 * The channel name for bot tracking.
 * @internal
 */
export const BOT_CHANNEL = 'bot';

/**
 * True when a browser `document` global is available (client / jsdom).
 * Used so server-only code paths can be tested without mutating `document`.
 * @internal
 */
export function isBrowserEnvironment(): boolean {
  return typeof document !== 'undefined';
}

/**
 * A function that checks if visitor is a bot.
 * @param {string} userAgent - The user agent of the visitor
 * @returns {boolean} True if the visitor is a bot, false otherwise
 * @internal
 */
export const isBot = (userAgent?: string | null): boolean => {
  return isbot(userAgent);
};

/**
 * A function that gets the bot cookie.
 * @returns {string | undefined} The value of the bot cookie, or undefined if the cookie is not found.
 * Only available on the client-side.
 * @internal
 */
export function getBotCookie(): string | undefined {
  if (!isBrowserEnvironment()) return undefined;

  return getCookie(document.cookie, BOT_DETECTION_COOKIE)?.value;
}
