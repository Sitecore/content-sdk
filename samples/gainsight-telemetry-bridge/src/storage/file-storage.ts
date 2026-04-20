import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { EventStorage, StoredEvent } from './event-storage.js';
import type { CSDKTelemetryEvent } from '../models.js';

/**
 * File-based implementation of EventStorage.
 * Stores events as individual JSON files in a directory.
 */
export class FileEventStorage implements EventStorage {
  private readonly storageDir: string;

  constructor(storageDir: string = '.telemetry-events') {
    this.storageDir = storageDir;
  }

  async init(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== 'EEXIST') {
        throw new Error(`Failed to create storage directory: ${err.message}`);
      }
    }
  }

  async add(event: CSDKTelemetryEvent): Promise<string> {
    await this.init();
    const id = randomUUID();
    const stored: StoredEvent = {
      id,
      event,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const filePath = path.join(this.storageDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(stored, null, 2), 'utf-8');
    return id;
  }

  async getAll(): Promise<StoredEvent[]> {
    try {
      await this.init();
      const files = await fs.readdir(this.storageDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const events: StoredEvent[] = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.storageDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const stored = JSON.parse(content) as StoredEvent;
          events.push(stored);
        } catch (e) {
          console.error(`Failed to read event file ${file}:`, e);
        }
      }
      return events;
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return [];
      }
      throw e;
    }
  }

  async remove(id: string): Promise<void> {
    const filePath = path.join(this.storageDir, `${id}.json`);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        throw new Error(`Failed to remove event ${id}: ${err.message}`);
      }
    }
  }

  async incrementRetry(id: string): Promise<void> {
    const filePath = path.join(this.storageDir, `${id}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stored = JSON.parse(content) as StoredEvent;
      stored.retryCount += 1;
      await fs.writeFile(filePath, JSON.stringify(stored, null, 2), 'utf-8');
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        throw new Error(`Failed to increment retry for event ${id}: ${err.message}`);
      }
    }
  }
}
