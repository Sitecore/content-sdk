import { awaitInit } from '../initializer/browser/initializer';
import { eventQueue } from './eventStorage';

/**
 * Deletes the queue from session.
 */
export async function clearEventQueue(): Promise<void> {
  await awaitInit();

  eventQueue.clearQueue();
}
