"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetryEventToGainsightPayload = telemetryEventToGainsightPayload;
exports.sendGainsightCustomEvent = sendGainsightCustomEvent;
/** Fields Gainsight PX accepts on POST /v1/events/custom (lifted out of `data`). */
const PX_TOP_LEVEL_KEYS = new Set([
    'identifyId',
    'accountId',
    'sessionId',
    'userType',
    'url',
    'referrer',
    'remoteHost',
    'globalContext',
    'propertyKey',
    'eventType',
    'eventId',
]);
function parseEventDate(input) {
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
 * Maps a TelemetryEvent to the JSON body for
 * {@link https://px-apidocs.gainsight.com/operation/operation-createcustomeventusingpost.md Gainsight PX Create custom event}.
 */
function telemetryEventToGainsightPayload(event) {
    if (typeof event.type !== 'string' || !event.type.trim()) {
        throw new Error('Invalid payload: "type" must be a non-empty string (maps to eventName).');
    }
    const raw = event.data;
    if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error('Invalid payload: "data" must be a JSON object.');
    }
    const data = raw;
    const payload = {
        eventName: event.type,
        date: parseEventDate(event.date),
    };
    for (const key of PX_TOP_LEVEL_KEYS) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            payload[key] = data[key];
        }
    }
    const attributes = { ...data };
    for (const key of PX_TOP_LEVEL_KEYS) {
        delete attributes[key];
    }
    if (Object.keys(attributes).length > 0) {
        payload.attributes = attributes;
    }
    const identifyId = payload.identifyId;
    if (typeof identifyId !== 'string' || !identifyId.trim()) {
        throw new Error('Invalid payload: set "identifyId" inside "data" (Gainsight PX requires identifyId for custom events).');
    }
    return payload;
}
async function sendGainsightCustomEvent(baseUrl, apiKey, body) {
    const url = `${baseUrl.replace(/\/$/, '')}/events/custom`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-APTRINSIC-API-KEY': apiKey,
        },
        body: JSON.stringify(body),
    });
    let json;
    const text = await res.text();
    try {
        json = text ? JSON.parse(text) : null;
    }
    catch {
        json = text;
    }
    if (!res.ok) {
        const err = new Error(`Gainsight PX API error: ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 500)}` : ''}`);
        err.status = res.status;
        err.body = json;
        throw err;
    }
    return { status: res.status, json };
}
