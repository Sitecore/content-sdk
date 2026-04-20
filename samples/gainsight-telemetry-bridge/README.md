# Gainsight Telemetry Bridge

Express service that receives telemetry events, stores them, and batches them to Gainsight PX REST API.

## Features

- **Event Storage**: Pluggable storage interface (file-based implementation included)
- **Batch Processing**: Configurable scheduled processing (default 5 minutes)
- **Retry Logic**: Automatic retry with configurable max attempts (default 3)
- **Graceful Shutdown**: Cleanly stops batch processor on SIGINT/SIGTERM

## Setup

### Environment Variables

Create `.env` file:

```env
PORT=3100
GAINSIGHT_API_KEY=your-rest-api-key-from-px-admin
GAINSIGHT_BASE_URL=https://api-eu.aptrinsic.com/v1
GAINSIGHT_PROPERTY_KEY=AP-YOUR-PRODUCT-KEY
GAINSIGHT_IDENTIFY_ID=default-user-id

# Optional
BATCH_INTERVAL_MS=300000  # 5 minutes (default)
STORAGE_DIR=.telemetry-events  # default
```

### Install & Run

```bash
npm run start
```

## API Endpoints

### `POST /events`

Send a telemetry event. Attempts immediate delivery; stores for batch retry on failure.

**Request body:**

```json
{
  "name": "sdk-installed",
  "data": {
    "template": "nextjs",
    "nodeVersion": "20.0.0"
  },
  "date": "2026-04-20T12:00:00.000Z"
}
```

**Response (201 - sent immediately):**

```json
{
  "ok": true,
  "sent": "immediately"
}
```

**Response (202 - queued for retry):**

```json
{
  "accepted": true,
  "id": "uuid",
  "sent": "queued",
  "message": "Event stored for batch retry",
  "reason": "Gainsight PX API error: 401 Unauthorized"
}
```

### `POST /process-batch`

Manually trigger batch processing (for testing/debugging).

**Response:**

```json
{
  "ok": true,
  "message": "Batch processing triggered"
}
```

### `GET /health`

Health check.

## Storage

### File-based Storage (default)

Events are stored as individual JSON files in `.telemetry-events/` directory. Each file contains:

```json
{
  "id": "uuid",
  "event": { "name": "...", "data": {...} },
  "timestamp": 1713622800000,
  "retryCount": 0
}
```

### Custom Storage

Implement the `EventStorage` interface:

```typescript
export interface EventStorage {
  add(event: TelemetryEvent): Promise<string>;
  getAll(): Promise<StoredEvent[]>;
  remove(id: string): Promise<void>;
  incrementRetry(id: string): Promise<void>;
  close?(): Promise<void>;
}
```

## Batch Processing

The batch processor runs on a configurable interval:

1. Fetches all stored events
2. For each event:
   - If `retryCount >= maxRetries` (3): remove and skip
   - Otherwise: attempt to send to Gainsight PX
   - On success: remove from storage
   - On failure: increment `retryCount` and keep in storage

Events that exceed `maxRetries` are automatically removed.

## Integration with Telemetry Service

Update `packages/core/src/tools/telemetry/telemetry-service.ts`:

```typescript
static TELEMETRY_POST_URL = process.env.TELEMETRY_POST_URL ?? 'http://localhost:3100/events';

static async dispatch(eventInit: TelemetryEventInitializer) {
  // ... validation ...
  
  const event = eventInit();
  event.date = new Date();
  
  await fetch(this.TELEMETRY_POST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  
  return true;
}
```
