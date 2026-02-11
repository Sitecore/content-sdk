import { getCoreContext } from '@sitecore-content-sdk/core';
import { eventQueue } from './eventStorage';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * Deletes the queue from session.
 * @public
 */
export async function clearEventQueue(): Promise<void> {
  await getCoreContext().readyPromise;
  getEventsPlugin();

  eventQueue.clearQueue();
}
