import type { EventStorage } from '../storage/event-storage.js';
import { sendGainsightCustomEvent } from '../gainsight.js';

export type BatchProcessorConfig = {
  storage: EventStorage;
  /**
   * Interval in milliseconds between batch processing runs.
   * @default 300000 (5 minutes)
   */
  intervalMs?: number;
  /**
   * Maximum number of retries before giving up on an event.
   * @default 3
   */
  maxRetries?: number;
};

/**
 * Batch processor that periodically sends stored events to Gainsight.
 */
export class BatchProcessor {
  private readonly storage: EventStorage;
  private readonly intervalMs: number;
  private readonly maxRetries: number;
  private intervalHandle: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(config: BatchProcessorConfig) {
    this.storage = config.storage;
    this.intervalMs = config.intervalMs ?? 5 * 60 * 1000; // 5 minutes
    this.maxRetries = config.maxRetries ?? 3;
  }

  /**
   * Start the batch processor.
   */
  start(): void {
    if (this.intervalHandle) {
      console.warn('BatchProcessor is already running');
      return;
    }

    console.log(
      `BatchProcessor started (interval: ${this.intervalMs}ms, maxRetries: ${this.maxRetries})`
    );

    // Process immediately on start
    this.processBatch().catch((e) => {
      console.error('Initial batch processing failed:', e);
    });

    this.intervalHandle = setInterval(() => {
      this.processBatch().catch((e) => {
        console.error('Batch processing failed:', e);
      });
    }, this.intervalMs);
  }

  /**
   * Stop the batch processor.
   */
  stop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
      console.log('BatchProcessor stopped');
    }
  }

  /**
   * Process all stored events.
   */
  async processBatch(): Promise<void> {
    if (this.isProcessing) {
      console.log('Batch processing already in progress, skipping...');
      return;
    }

    this.isProcessing = true;
    try {
      const events = await this.storage.getAll();

      if (events.length === 0) {
        console.log('No events to process');
        return;
      }

      console.log(`Processing ${events.length} stored event(s)...`);
      let successCount = 0;
      let failureCount = 0;
      let skippedCount = 0;

      for (const stored of events) {
        if (stored.retryCount >= this.maxRetries) {
          console.warn(
            `Event ${stored.id} exceeded max retries (${stored.retryCount}/${this.maxRetries}), removing...`
          );
          await this.storage.remove(stored.id);
          skippedCount++;
          continue;
        }

        try {
          const eventName = stored.event.name;
          const attributes = (stored.event.data ?? {}) as Record<string, unknown>;

          if (typeof eventName !== 'string' || !eventName.trim()) {
            console.error(`Event ${stored.id} has invalid event name, removing...`);
            await this.storage.remove(stored.id);
            skippedCount++;
            continue;
          }

          await sendGainsightCustomEvent(eventName, attributes, stored.event.date);
          await this.storage.remove(stored.id);
          successCount++;
          console.log(`Event ${stored.id} (${eventName}) sent successfully`);
        } catch (e) {
          const err = e as Error;
          console.error(`Failed to send event ${stored.id}:`, err.message);
          await this.storage.incrementRetry(stored.id);
          failureCount++;
        }
      }

      console.log(
        `Batch complete: ${successCount} sent, ${failureCount} failed, ${skippedCount} skipped/removed`
      );
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process batch once and return (for manual triggering).
   */
  async processOnce(): Promise<void> {
    await this.processBatch();
  }
}
