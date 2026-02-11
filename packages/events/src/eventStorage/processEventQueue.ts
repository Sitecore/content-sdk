import { getCoreContext } from '@sitecore-content-sdk/core';
import { eventQueue } from './eventStorage';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * A function that sends all queue events to the SitecoreCloud API.
 * Clears the queue upon completion.
 * @public
 */
export async function processEventQueue(): Promise<void> {
  await getCoreContext().readyPromise;
  getEventsPlugin();

  eventQueue.sendAllEvents();
}
