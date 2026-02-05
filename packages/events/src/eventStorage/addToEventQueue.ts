import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import type { EventData } from '../events';
import type { QueueEventPayload } from './eventStorage';
import { eventQueue } from './eventStorage';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * A function that adds event to the queue
 * @param {EventData} eventData - The required/optional attributes in order to be send to SitecoreCloud API
 */
export async function addToEventQueue(eventData: EventData): Promise<void> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { settings, environment } = getAnalyticsPlugin();
  const id = environment.getClientId() || '';

  const queueEventPayload: QueueEventPayload = {
    eventData,
    id,
    settings: { ...coreContext.settings, ...settings },
  };

  eventQueue.enqueueEvent(queueEventPayload);
}
