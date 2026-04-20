import type { CSDKTelemetryEvent, GainsightPxCustomEvent } from './models.js';

function parseEventDate(input: CSDKTelemetryEvent['date']): number {
  if (input == null) {
    return Date.now();
  }
  if (typeof input === 'number' && Number.isFinite(input)) {
    return input < 1e12 ? input * 1000 : input;
  }
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) {
    return Date.now();
  }
  return d.getTime();
}

/**
 * Builds a {@link GainsightPxCustomEventBody} from `eventName` + flat `attributes`.
 *
 * - `eventName` → PX `eventName`
 * - `attributes.identifyId` (required), `accountId`, `sessionId`, etc. are lifted to the body's top-level.
 * - Remaining keys in `attributes` become PX `attributes`.
 * - `date` defaults to now (epoch ms).
 */
export function buildGainsightPayload(
  eventName: string,
  attributes: Record<string, unknown>,
  date?: CSDKTelemetryEvent['date']
): GainsightPxCustomEvent {
  if (typeof eventName !== 'string' || !eventName.trim()) {
    throw new Error('eventName must be a non-empty string.');
  }
  if (attributes == null || typeof attributes !== 'object' || Array.isArray(attributes)) {
    throw new Error('attributes must be a plain object.');
  }

  const identifyId = process.env.GAINSIGHT_IDENTIFY_ID;
  if (!identifyId) {
    throw new Error('GAINSIGHT_IDENTIFY_ID is required.');
  }
  const propertyKey = process.env.GAINSIGHT_PROPERTY_KEY;
  if (!propertyKey) {
    throw new Error('GAINSIGHT_PROPERTY_KEY is required.');
  }
  const body: GainsightPxCustomEvent = {
    eventName: eventName.trim(),
    identifyId: identifyId.trim(),
    userType: 'USER',
    propertyKey: propertyKey.trim(),
    date: parseEventDate(date),
    attributes,
  };

  return body;
}

/**
 * Sends one custom event to Gainsight PX.
 *
 * @param baseUrl  e.g. `https://api.aptrinsic.com/v1`
 * @param apiKey   REST API key from PX Administration
 * @param eventName  Custom event name
 * @param attributes  Flat object: must include `identifyId`; may include other PX fields and custom keys
 * @param date  Optional timestamp (defaults to now)
 */
export async function sendGainsightCustomEvent(
  eventName: string,
  attributes: Record<string, unknown>,
  date?: CSDKTelemetryEvent['date']
): Promise<{ status: number; json: unknown }> {
  const body = buildGainsightPayload(eventName, attributes, date);
  const baseUrl = process.env.GAINSIGHT_BASE_URL;
  if (!baseUrl) {
    throw new Error('GAINSIGHT_BASE_URL is required.');
  }
  const apiKey = process.env.GAINSIGHT_API_KEY;
  if (!apiKey) {
    throw new Error('GAINSIGHT_API_KEY is required.');
  }
  const url = `${baseUrl.replace(/\/$/, '')}/v1/events/custom`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-APTRINSIC-API-KEY': apiKey,
    },
    body: JSON.stringify(body),
  });

  let json: unknown;
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    const err = new Error(
      `Gainsight PX API error: ${res.status} ${res.statusText}${
        text ? ` — ${text.slice(0, 500)}` : ''
      }`
    );
    throw err;
  } else {
    console.log('Gainsight PX API event sent successfully: %s', body.eventName);
  }

  return { status: res.status, json };
}
