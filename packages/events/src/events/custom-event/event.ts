import type { EPResponse } from '@sitecore-content-sdk/analytics-core/internal';
import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../../initialization/plugin';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 * @param {EventData} eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function event(eventData: EventData): Promise<EPResponse | null> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { settings, adapter } = getAnalyticsPlugin();

  const id = adapter.getClientId() || '';

  return new CustomEvent({
    eventData,
    id,
    sendEvent,
    settings: { ...coreContext.settings, ...settings },
  }).send();
}
