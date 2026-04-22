import { getAnalyticsPlugin, type EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { PageViewEvent } from './page-view-event';

/**
 * The channel name for bot tracking.
 * @internal
 */
export const BOT_CHANNEL = 'bot';

/**
 * The data to be sent for bot tracking.
 * @public
 */
export type BotPageViewData = {
  /**
   * The name of the webpage where the interaction with your brand takes place.
   */
  page: string;
  /**
   * The language the site visitor interacts with your brand in.
   * For example, if the site visitor selects the Japanese language in your app, the language is "JA".
   * Format: uppercase ISO 639.
   */
  language: string;
  /**
   * Full `User-Agent` of the request. Sent in event `ext` as `sourceUserAgent` (distinct from any `User-Agent` header on the HTTP request).
   */
  userAgent: string;
};

/**
 * Derives a deterministic, UUID-shaped client id from the given input by hashing
 * it with SHA-256. The same input always produces the same id, which allows
 * analytics to treat repeated requests from the same crawler as a single visitor.
 * @param {string} input - The value used as the fingerprint source (typically the User-Agent).
 * @returns {Promise<string>} A UUID-shaped string derived from the SHA-256 hash of the input.
 * @internal
 */
async function deriveBotClientId(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer).slice(0, 16);

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Sends a VIEW event for bot tracking.
 * Derives a stable client id from `userAgent` so repeated requests from the same
 * crawler share a single id, and defaults `channel` to `bot`.
 * @param {BotPageViewData} [pageViewData] - The optional attributes to be sent to the SitecoreCloud API
 * @returns The response from Sitecore Edge Proxy.
 * @public
 */
export async function botPageView(pageViewData: BotPageViewData): Promise<EPResponse | null> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();
  const id = await deriveBotClientId(pageViewData.userAgent);

  return new PageViewEvent({
    id,
    pageViewData: {
      channel: BOT_CHANNEL,
      page: pageViewData.page,
      language: pageViewData.language,
      extensionData: {
        sourceUserAgent: pageViewData.userAgent,
      },
    },
    searchParams: adapter.location.getSearchParams(),
    sendEvent,
    config: { ...coreContext.config, ...options },
  }).send();
}
