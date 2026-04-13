import express from 'express';
import type { TelemetryEvent } from './telemetry-event.js';
import { sendGainsightCustomEvent, telemetryEventToGainsightPayload } from './gainsight';

const app = express();
app.use(express.json({ limit: '256kb' }));

const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.GAINSIGHT_API_KEY ?? '';
const baseUrl =
  process.env.GAINSIGHT_BASE_URL?.replace(/\/$/, '') ?? 'https://api.aptrinsic.com/v1';

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * Accepts TelemetryEvent JSON: { type, data, date? }.
 * `data` must include `identifyId` (and may include other PX top-level keys); remaining keys become `attributes`.
 */
app.post('/events', async (req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: 'GAINSIGHT_API_KEY is not set' });
    return;
  }

  let payload: ReturnType<typeof telemetryEventToGainsightPayload>;
  try {
    payload = telemetryEventToGainsightPayload(req.body as TelemetryEvent);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(400).json({ error: message });
    return;
  }

  try {
    const { status, json } = await sendGainsightCustomEvent(baseUrl, apiKey, payload);
    res.status(status).json(json ?? { ok: true });
  } catch (e) {
    const err = e as Error & { status?: number; body?: unknown };
    const status = typeof err.status === 'number' ? err.status : 502;
    res.status(status).json({
      error: err.message,
      gainsight: err.body,
    });
  }
});

app.listen(port, () => {
  console.log(
    `Gainsight telemetry bridge listening on http://localhost:${port} (POST /events, GAINSIGHT_BASE_URL=${baseUrl})`
  );
});
