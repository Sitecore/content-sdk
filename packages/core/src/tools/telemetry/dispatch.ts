import os from 'os';
import debug from '../../debug';
import { normalizeEnvValue } from '../normalize-env-value';
import {
  DEFAULT_TELEMETRY_URL,
  TELEMETRY_DISABLED_ENV,
  TELEMETRY_DISPATCH_TIMEOUT_MS,
  TELEMETRY_URL_ENV,
  DispatchTelemetryOptions,
  TelemetryEvent,
  TelemetryFingerprint,
  TelemetryPrimitive,
} from './models';

const SNAKE_CASE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const MAX_DATA_KEYS = 32;
const MAX_STRING_LENGTH = 512;

const telemetryDebug = debug.telemetry;

/**
 * Reports whether telemetry should send.
 * A per-command opt-out wins, then `SITECORE_TELEMETRY_DISABLED`.
 * @param {boolean} [enabled] Pass `false` to skip this call. `true` does not override the environment variable.
 * @returns {boolean} `true` when a dispatch may be attempted
 * @public
 */
export function isTelemetryEnabled(enabled?: boolean): boolean {
  if (enabled === false) {
    return false;
  }

  const raw = process.env[TELEMETRY_DISABLED_ENV];
  if (!raw) {
    return true;
  }

  const value = raw.trim().toLowerCase();
  return value !== '1' && value !== 'true' && value !== 'yes';
}

/**
 * Resolves the receiver URL.
 * An explicit override wins, then `SITECORE_TELEMETRY_URL`, then {@link DEFAULT_TELEMETRY_URL}.
 * @param {string} [override] URL for this call
 * @returns {string} Absolute URL
 * @public
 */
export function resolveTelemetryUrl(override?: string): string {
  return (
    normalizeEnvValue(override) ??
    normalizeEnvValue(process.env[TELEMETRY_URL_ENV]) ??
    DEFAULT_TELEMETRY_URL
  );
}

/**
 * Builds the anonymous fingerprint from the current Node process.
 * @param {string} packageName Published package name
 * @param {string} packageVersion Published package version
 * @returns {TelemetryFingerprint} Fingerprint for an unauthenticated request
 * @public
 */
export function createTelemetryFingerprint(
  packageName: string,
  packageVersion: string
): TelemetryFingerprint {
  return {
    packageName,
    packageVersion,
    os: `${os.platform()}/${os.arch()}`,
    runtimeVersion: `node/${process.versions.node}`,
  };
}

/**
 * Posts one telemetry event.
 * Invalid events and network failures are debug-logged and returned as `false`.
 * This function does not throw.
 * @param {TelemetryEvent} event Event to send
 * @param {DispatchTelemetryOptions} [options] Per-call overrides
 * @returns {Promise<boolean>} `true` when the receiver accepts the event
 * @public
 */
export async function dispatchTelemetryEvent(
  event: TelemetryEvent,
  options: DispatchTelemetryOptions = {}
): Promise<boolean> {
  if (!isTelemetryEnabled(options.enabled)) {
    telemetryDebug('skipped (telemetry is disabled)');
    return false;
  }

  const payload = normalizeEvent(event);
  if (!payload) {
    telemetryDebug('skipped (invalid event) %O', event);
    return false;
  }

  const url = resolveTelemetryUrl(options.url);
  const timeoutMs = options.timeoutMs ?? TELEMETRY_DISPATCH_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;

  telemetryDebug('sending %s %O', url, payload);

  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    telemetryDebug('dispatch %s status %s', payload.name, response.status);
    return response.ok;
  } catch (error) {
    telemetryDebug('dispatch failed %O', error);
    return false;
  }
}

/**
 * Returns a receiver-shaped body, or undefined when the event cannot be sent.
 * @param {TelemetryEvent} event Candidate event
 * @returns {TelemetryEvent | undefined} Normalized event
 */
function normalizeEvent(event: TelemetryEvent): TelemetryEvent | undefined {
  if (!isSnakeCase(event.source) || !isSnakeCase(event.name)) {
    return undefined;
  }

  if (!event.fingerprint?.packageName || !event.fingerprint.packageVersion) {
    return undefined;
  }

  const data = normalizeData(event.data);
  if (!data) {
    return undefined;
  }

  if (event.date !== undefined && !isValidDate(event.date)) {
    return undefined;
  }

  const fingerprint: TelemetryFingerprint = {
    packageName: event.fingerprint.packageName,
    packageVersion: event.fingerprint.packageVersion,
  };

  if (event.fingerprint.os) {
    fingerprint.os = clip(event.fingerprint.os);
  }

  if (event.fingerprint.runtimeVersion) {
    fingerprint.runtimeVersion = clip(event.fingerprint.runtimeVersion);
  }

  return {
    source: event.source,
    name: event.name,
    data,
    date: event.date ?? Date.now(),
    fingerprint,
  };
}

/**
 * Copies flat primitive data, or returns undefined when the object is not sendable.
 * @param {TelemetryEvent['data']} data Event attributes
 * @returns {TelemetryEvent['data'] | undefined} Normalized attributes
 */
function normalizeData(data: TelemetryEvent['data']): TelemetryEvent['data'] | undefined {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return undefined;
  }

  const keys = Object.keys(data);
  if (keys.length > MAX_DATA_KEYS) {
    return undefined;
  }

  const normalized: Record<string, TelemetryPrimitive> = {};

  for (const key of keys) {
    if (!key) {
      return undefined;
    }

    const value = data[key];
    if (!isPrimitive(value)) {
      return undefined;
    }

    if (typeof value === 'string' && value.length > MAX_STRING_LENGTH) {
      return undefined;
    }

    normalized[key] = value;
  }

  return normalized;
}

/**
 * @param {unknown} value Candidate attribute value
 * @returns {boolean} Whether the value can be sent as event data
 */
function isPrimitive(value: unknown): value is TelemetryPrimitive {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return true;
  }

  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * @param {unknown} value Candidate identifier
 * @returns {boolean} Whether the value is a snake_case string
 */
function isSnakeCase(value: unknown): value is string {
  return typeof value === 'string' && SNAKE_CASE.test(value);
}

/**
 * @param {number} value Candidate event date
 * @returns {boolean} Whether the value is a positive finite timestamp
 */
function isValidDate(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

/**
 * @param {string} value Fingerprint field
 * @returns {string} Value trimmed to the receiver string limit
 */
function clip(value: string): string {
  return value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) : value;
}
