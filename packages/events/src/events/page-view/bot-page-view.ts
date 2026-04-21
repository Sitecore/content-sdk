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
 * Sends a VIEW event for bot tracking.
 * Uses a synthetic per-invocation client id and defaults `channel` to `bot`.
 * @param {BotPageViewData} [pageViewData] - The optional attributes to be sent to the SitecoreCloud API
 * @returns The response from Sitecore Edge Proxy.
 * @public
 */
export async function botPageView(pageViewData: BotPageViewData): Promise<EPResponse | null> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();
  const id = globalThis.crypto.randomUUID();

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
