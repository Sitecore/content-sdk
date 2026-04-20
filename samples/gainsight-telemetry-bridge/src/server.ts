import express from 'express';
import type { CSDKTelemetryEvent } from './models.js';
import { FileEventStorage } from './storage/file-storage.js';
import { BatchProcessor } from './scheduling/batch-processor.js';
import { sendGainsightCustomEvent } from './gainsight.js';
import 'dotenv/config';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;
const batchIntervalMs = Number(process.env.BATCH_INTERVAL_MS) || 5 * 60 * 1000; // 5 minutes default
const storageDir = process.env.STORAGE_DIR || '.telemetry-events';

const storage = new FileEventStorage(storageDir);
const batchProcessor = new BatchProcessor({
  storage,
  intervalMs: batchIntervalMs,
  maxRetries: 3,
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * Accepts TelemetryEvent JSON: { name, data, date? }.
 * Attempts to send immediately; stores only if sending fails.
 */
app.post('/events', async (req, res) => {
  console.log('Received telemetry event: %s', JSON.stringify(req.body, null, 2));
  const event = req.body as CSDKTelemetryEvent;

  const eventName = event?.name;
  const attributes = event?.data as Record<string, unknown> | undefined;

  if (typeof eventName !== 'string' || !eventName.trim()) {
    console.error('Invalid event name: %s', eventName);
    res.status(400).json({ error: '"name" must be a non-empty string.' });
    return;
  }
  if (attributes == null || typeof attributes !== 'object' || Array.isArray(attributes)) {
    console.error('Invalid event attributes: %s', attributes);
    res.status(400).json({ error: '"data" must be a plain object.' });
    return;
  }

  // Try sending immediately
  try {
    const { status, json } = await sendGainsightCustomEvent(eventName, attributes, event.date);
    console.log(`Event sent immediately: ${eventName} (status: ${status})`);
    res.status(status).json(json ?? { ok: true, sent: 'immediately' });
  } catch (e) {
    // Send failed - store for batch retry
    const err = e as Error & { status?: number; body?: unknown };
    console.warn(`Immediate send failed (${err.message}), storing for batch retry...`);

    try {
      const id = await storage.add(event);
      console.log(`Event stored with id: ${id} for retry`);
      res.status(202).json({
        accepted: true,
        id,
        sent: 'queued',
        message: 'Event stored for batch retry',
        reason: err.message,
      });
    } catch (storageErr) {
      const sErr = storageErr as Error;
      console.error('Failed to store event after send failure:', sErr);
      res.status(500).json({
        error: 'Failed to send and failed to store',
        sendError: err.message,
        storageError: sErr.message,
      });
    }
  }
});

/**
 * Manually trigger batch processing (useful for debugging/testing).
 */
app.post('/process-batch', async (req, res) => {
  try {
    await batchProcessor.processOnce();
    res.json({ ok: true, message: 'Batch processing triggered' });
  } catch (e) {
    const err = e as Error;
    console.error('Error processing batch:', err);
    res.status(500).json({ error: err.message });
  }
});

app.use((req) => {
  console.error('No route matched: %s %s', req.method, req.originalUrl);
});

app.listen(port, () => {
  console.log(`Gainsight telemetry bridge listening on http://localhost:${port}`);
  console.log(`  POST /events - Send telemetry event (stores on failure)`);
  console.log(`  POST /process-batch - Manually trigger batch processing`);
  console.log(`  GET /health - Health check`);
  console.log(`Storage: ${storageDir}`);
  console.log(`Batch interval: ${batchIntervalMs}ms (${batchIntervalMs / 1000 / 60} minutes)`);

  // Start batch processor
  batchProcessor.start();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  batchProcessor.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  batchProcessor.stop();
  process.exit(0);
});
