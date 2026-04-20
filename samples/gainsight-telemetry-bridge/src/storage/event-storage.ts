import type { CSDKTelemetryEvent } from '../models.js';

export type StoredEvent = {
  id: string;
  event: CSDKTelemetryEvent;
  timestamp: number;
  retryCount: number;
};

/**
 * Abstract storage interface for telemetry events.
 * Implementations can use file system, Redis, etc.
 */
export interface EventStorage {
  /**
   * Add an event to storage.
   * @returns The unique ID assigned to the event.
   */
  add(event: CSDKTelemetryEvent): Promise<string>;

  /**
   * Get all stored events.
   */
  getAll(): Promise<StoredEvent[]>;

  /**
   * Remove an event from storage by ID.
   */
  remove(id: string): Promise<void>;

  /**
   * Increment retry count for an event.
   */
  incrementRetry(id: string): Promise<void>;

  /**
   * Close/cleanup storage resources.
   */
  close?(): Promise<void>;
}
