import { getAnalyticsPlugin, type EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';
import { sendEvent } from '../send-event/sendEvent';
import { PageViewEvent } from './page-view-event';
import { BOT_CHANNEL, isBrowserEnvironment } from './bot-detection';

type BotPageView = {
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
};

/**
 * Sends a VIEW event for server-side bot tracking (e.g. Next.js proxy / Edge).
 * Uses a synthetic per-invocation client id and defaults `channel` to `bot`.
 * Returns `null` in browser environments.
 * @param {BotPageView} [pageViewData] - The optional attributes to be sent to the SitecoreCloud API
 * @returns The response from Sitecore Edge Proxy, or `null` if skipped (browser).
 * @public
 */
export async function botPageView(pageViewData: BotPageView): Promise<EPResponse | null> {
  if (isBrowserEnvironment()) {
    return null;
  }

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
    },
    searchParams: adapter.location.getSearchParams(),
    sendEvent,
    config: { ...coreContext.config, ...options },
  }).send();
}
