import { getCoreContext } from '@sitecore-content-sdk/core';
import { eventQueue } from './eventStorage';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * A function that sends all queue events to SitecoreCloud API.
 * Clears the queue upon completion.
 */
export async function processEventQueue(): Promise<void> {
  await getCoreContext().readyPromise;
  getEventsPlugin();

  eventQueue.sendAllEvents();
}
