import { getCoreSettings } from '@sitecore-content-sdk/core';
import { eventQueue } from './eventStorage';
import { getEventsPlugin } from '../initialization/plugin';

/**
 * Deletes the queue from session.
 */
export async function clearEventQueue(): Promise<void> {
  await getCoreSettings().readyPromise;
  getEventsPlugin();

  eventQueue.clearQueue();
}
