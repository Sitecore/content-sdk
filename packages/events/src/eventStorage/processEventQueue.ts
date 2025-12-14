import { awaitInit } from '../initializer/browser/initializer';
import { eventQueue } from './eventStorage';

/**
 * A function that sends all queue events to SitecoreCloud API.
 * Clears the queue upon completion.
 */
export async function processEventQueue(): Promise<void> {
  await awaitInit();

  eventQueue.sendAllEvents();
}
