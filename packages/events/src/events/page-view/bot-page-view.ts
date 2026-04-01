import { getAnalyticsPlugin, type EPResponse } from "@sitecore-content-sdk/analytics-core/internal";
import { getCoreContext } from "@sitecore-content-sdk/core";
import { getEventsPlugin } from "../../initialization/plugin";
import { sendEvent } from "../send-event/sendEvent";
import { PageViewEvent } from "./page-view-event";
import { BOT_CHANNEL, isBrowserEnvironment } from "./bot-detection";

/**
 * Sends a VIEW event for server-side bot tracking (e.g. Next.js proxy / Edge).
 * Uses a synthetic per-invocation client id and defaults `channel` to `bot`.
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
