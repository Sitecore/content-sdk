import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';
import { BOT_CHANNEL, getBotCookie, isBot, isBrowserEnvironment } from './bot-detection';

/**
 * A function that checks if the page view should be skipped.
 * The page view is skipped if the visitor is a bot.
 * @returns {boolean} True if the page view should be skipped, false otherwise
 * @internal
 */
const shouldSkipPageView = () => {
  const botCookie = getBotCookie();

  if (botCookie) return true;

  return isBot(navigator.userAgent);
};

/**
 * Sends a VIEW event for server-side bot tracking (e.g. Next.js proxy / Edge).
 * Uses a synthetic per-invocation client id and defaults {@link PageViewData.channel} to {@link BOT_CHANNEL}.
 * Returns `null` in browser environments.
 * @returns The response from Sitecore Edge Proxy, or `null` if skipped (browser).
 * @public
 */
export async function botPageView(): Promise<EPResponse | null> {
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
    },
    searchParams: adapter.location.getSearchParams(),
    sendEvent,
    config: { ...coreContext.config, ...options },
  }).send();
}

/**
 * A function that sends a VIEW event to the SitecoreCloud API
 * @param {PageViewData} [pageViewData] - The optional attributes to be sent to the SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload.
 * The page view will be skipped if the visitor on the client-side is a bot.
 * @returns The response object that Sitecore Edge Proxy returns
 * @public
 */
export async function pageView(pageViewData?: PageViewData): Promise<EPResponse | null> {
  if (shouldSkipPageView()) return null;

  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();
  const id = adapter.getClientId() || '';
  const searchParams = adapter.location.getSearchParams();

  return new PageViewEvent({
    id,
    pageViewData,
    searchParams,
    sendEvent,
    config: { ...coreContext.config, ...options },
  }).send();
}
