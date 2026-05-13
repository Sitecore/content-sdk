import { language, pageName } from '@sitecore-content-sdk/analytics-core/internal';
import { CustomEvent } from '../events';
import type { CustomEventArguments } from '../events';
import { sendEvent } from '../events/send-event/sendEvent';

class EventQueue {
  /**
   * Initialize the Event Storage
   */
  private key = 'EventQueue';

  /**
   * Adds the required event data to the queue and stores it in the storage.
   * @param {QueueEventPayload} queueEventPayload - The required event data for the creation of a `CustomEvent`.
   * Validates by creating a new `CustomEvent`.
   */
  enqueueEvent(queueEventPayload: QueueEventPayload) {
    const sessionStorage = this.getSessionStorage();

    queueEventPayload.eventData.page = queueEventPayload.eventData.page ?? pageName();
    queueEventPayload.eventData.language = queueEventPayload.eventData.language ?? language();

    new CustomEvent({
      sendEvent,
      ...queueEventPayload,
    });

    const eventQueue = this.getEventQueue();
    eventQueue.push(queueEventPayload);

    sessionStorage.setItem(this.key, JSON.stringify(eventQueue));
  }
  /**
   * Iterates the queue and sends sequentially the custom events to Sitecore Edge Proxy.
   */
  async sendAllEvents() {
    const eventQueue = this.getEventQueue();

    for (const queueEventPayload of eventQueue)
      await new CustomEvent({
        eventData: queueEventPayload.eventData,
        id: queueEventPayload.id,
        sendEvent,
        config: queueEventPayload.config,
      }).send();

    this.clearQueue();
  }

  /**
   * Clears the queue from storage.
   */
  clearQueue() {
    const sessionStorage = this.getSessionStorage();
    sessionStorage.removeItem(this.key);
  }

  /** Returns the stored array of data with type `QueueEventPayload`, or empty array if the given key does not exist. */
  private getEventQueue(): QueueEventPayload[] {
    const sessionStorage = this.getSessionStorage();

    const storedQueue = sessionStorage.getItem(this.key) ?? '""';

    try {
      const parsedQueueEvent: QueueEventPayload[] = JSON.parse(storedQueue);

      return Array.isArray(parsedQueueEvent) ? parsedQueueEvent : [];
    } catch {
      return [];
    }
  }

  private getSessionStorage() {
    return sessionStorage;
  }
}

/**
 * @internal
 */
export type QueueEventPayload = Pick<CustomEventArguments, 'eventData' | 'config' | 'id'>;

export const eventQueue = new EventQueue();
