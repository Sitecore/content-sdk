import { isbot } from 'isbot';
import { getCookieServerSide, getCookieValueClientSide } from '../utils';

/**
 * The cookie name for bot detection.
 * @internal
 */
export const BOT_DETECTION_COOKIE = 'sc_bot';

/**
 * A function that checks if visitor is a bot.
 * Performs a check based on the user agent.
 * @param {string} userAgent - The user agent of the visitor
 * @returns {boolean} True if the visitor is a bot, false otherwise
 * @internal
 */
export const isBot = (userAgent?: string | null): boolean => {
  return isbot(userAgent);
};

/**
 * A function that checks if visitor is a bot.
 * Performs a check based on the bot cookie and the user agent.
 * Only available on the client-side.
 * @returns {boolean} True if the visitor is a bot, false otherwise
 * @internal
 */
export const isBotClientSide = (): boolean => {
  return !!getBotCookieClientSide() || isbot(navigator.userAgent);
};

/**
 * A function that checks if visitor is a bot.
 * Performs a check based on the bot cookie and the user agent.
 * Only available on the server-side.
 * @param {string} cookie - The cookie string.
 * @param {string} userAgent - The user agent of the visitor
 * @returns {boolean} True if the visitor is a bot, false otherwise
 * @internal
 */
export const isBotServerSide = (cookie?: string, userAgent?: string | null): boolean => {
  return !!getBotCookieServerSide(cookie) || isbot(userAgent);
};

/**
 * A function that gets the bot cookie.
 * @returns {string | undefined} The value of the bot cookie, or undefined if the cookie is not found.
 * Only available on the client-side.
 * @internal
 */
export function getBotCookieClientSide(): string | undefined {
  return getCookieValueClientSide(BOT_DETECTION_COOKIE);
}

/**
 * A function that gets the bot cookie.
 * @param {string} cookie - The cookie string.
 * @returns {string | undefined} The value of the bot cookie, or undefined if the cookie is not found.
 * @internal
 */
export function getBotCookieServerSide(cookie?: string): string | undefined {
  return getCookieServerSide(cookie, BOT_DETECTION_COOKIE)?.value;
}
