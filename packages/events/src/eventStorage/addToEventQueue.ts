import { getAnalyticsPlugin } from '@sitecore-content-sdk/analytics-core/internal';
import type { EventData } from '../events';
import type { QueueEventPayload } from './eventStorage';
import { eventQueue } from './eventStorage';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * A function that adds an event to the queue
 * @param {EventData} eventData - The required/optional attributes in order to be sent to SitecoreCloud API
 * @public
 */
export async function addToEventQueue(eventData: EventData): Promise<void> {
  const coreContext = getCoreContext();
  await coreContext.readyPromise;
  getEventsPlugin();

  const { options, adapter } = getAnalyticsPlugin();
  const id = adapter.getClientId() || '';

  const queueEventPayload: QueueEventPayload = {
    eventData,
    id,
    config: { ...coreContext.config, ...options },
  };

  eventQueue.enqueueEvent(queueEventPayload);
}
