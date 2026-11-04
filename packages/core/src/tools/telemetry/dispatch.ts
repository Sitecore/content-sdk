import os from 'os';
import debug from '../../debug';
import { normalizeEnvValue } from '../normalize-env-value';
import { resolveEdgeUrl } from '../resolve-edge-url';
import {
  TELEMETRY_DISABLED_ENV,
  TELEMETRY_DISPATCH_TIMEOUT_MS,
  DispatchTelemetryOptions,
  TelemetryEvent,
  TelemetryFingerprint,
  TelemetryPrimitive,
} from './models';

const SNAKE_CASE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
const RELEASE_VERSION = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const OS_VALUE = /^[a-z0-9]+\/[a-z0-9_]+$/;
const RUNTIME_VERSION = /^node\/\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const MAX_DATA_KEYS = 32;
const MAX_STRING_LENGTH = 512;
const MAX_PACKAGE_NAME_LENGTH = 214;
const MAX_VERSION_LENGTH = 64;
const MAX_OS_LENGTH = 32;
const DATE_MAX_PAST_MS = 7 * 24 * 60 * 60 * 1000;
const DATE_MAX_FUTURE_MS = 5 * 60 * 1000;
const MAX_DISPATCHES_PER_WINDOW = 10;
const DISPATCH_WINDOW_MS = 60_000;

const dispatchTimestamps: number[] = [];

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

const TELEMETRY_EVENTS_PATH = '/telemetry/v1/events';

/**
 * Resolves the receiver URL.
 * `SITECORE_EDGE_PLATFORM_HOSTNAME` selects the host, the same way as other Edge calls.
 * The path is `/telemetry/v1/events`. An explicit override replaces that URL for one call.
 * @param {string} [override] URL for this call
 * @returns {string} Absolute URL
 * @public
 */
export function resolveTelemetryUrl(override?: string): string {
  const explicit = normalizeEnvValue(override);
  if (explicit) {
    return explicit;
  }

  return `${resolveEdgeUrl()}${TELEMETRY_EVENTS_PATH}`;
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

  if (!allowDispatch(Date.now())) {
    telemetryDebug('skipped (dispatch limit reached)');
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

  const fingerprint = normalizeFingerprint(event.fingerprint);
  if (!fingerprint) {
    return undefined;
  }

  const data = normalizeData(event.data);
  if (!data) {
    return undefined;
  }

  if (event.date !== undefined && !isValidDate(event.date)) {
    return undefined;
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
    if (!isSnakeCase(key)) {
      return undefined;
    }

    const value = data[key];
    if (!isPrimitive(value)) {
      return undefined;
    }

    if (typeof value === 'string' && !isAcceptableDataString(value)) {
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
 * Checks the fingerprint fields the receiver treats as structured.
 * A field that is present and does not match is rejected. Nothing is trimmed.
 * @param {TelemetryFingerprint | undefined} fingerprint Candidate fingerprint
 * @returns {TelemetryFingerprint | undefined} Fingerprint safe to send
 */
function normalizeFingerprint(
  fingerprint: TelemetryFingerprint | undefined
): TelemetryFingerprint | undefined {
  if (!fingerprint) {
    return undefined;
  }

  if (!isPackageName(fingerprint.packageName) || !isReleaseVersion(fingerprint.packageVersion)) {
    return undefined;
  }

  const normalized: TelemetryFingerprint = {
    packageName: fingerprint.packageName,
    packageVersion: fingerprint.packageVersion,
  };

  if (fingerprint.os !== undefined) {
    if (!isOs(fingerprint.os)) {
      return undefined;
    }
    normalized.os = fingerprint.os;
  }

  if (fingerprint.runtimeVersion !== undefined) {
    if (!isRuntimeVersion(fingerprint.runtimeVersion)) {
      return undefined;
    }
    normalized.runtimeVersion = fingerprint.runtimeVersion;
  }

  return normalized;
}

/**
 * @param {string} value Data string
 * @returns {boolean} Whether the string is within the receiver limit and has no control characters
 */
function isAcceptableDataString(value: string): boolean {
  return value.length > 0 && value.length <= MAX_STRING_LENGTH && !hasControlCharacter(value);
}

/**
 * @param {string} value Candidate string
 * @returns {boolean} Whether the string contains an ASCII control character
 */
function hasControlCharacter(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) {
      return true;
    }
  }

  return false;
}

/**
 * @param {string} value Package name
 * @returns {boolean} Whether the value is a short npm package name
 */
function isPackageName(value: string): boolean {
  return value.length <= MAX_PACKAGE_NAME_LENGTH && PACKAGE_NAME.test(value);
}

/**
 * @param {string} value Package version
 * @returns {boolean} Whether the value is a semver version, without a range prefix
 */
function isReleaseVersion(value: string): boolean {
  return value.length <= MAX_VERSION_LENGTH && RELEASE_VERSION.test(value);
}

/**
 * @param {string} value Operating system field
 * @returns {boolean} Whether the value is `platform/arch`
 */
function isOs(value: string): boolean {
  return value.length <= MAX_OS_LENGTH && OS_VALUE.test(value);
}

/**
 * @param {string} value Runtime field
 * @returns {boolean} Whether the value is `node/<semver>`
 */
function isRuntimeVersion(value: string): boolean {
  return value.length <= MAX_VERSION_LENGTH && RUNTIME_VERSION.test(value);
}

/**
 * Accepts a timestamp close to now. The receiver rejects dates outside
 * 7 days in the past and 5 minutes in the future.
 * @param {number} value Candidate event date
 * @returns {boolean} Whether the value is a plausible epoch millisecond timestamp
 */
function isValidDate(value: number): boolean {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return false;
  }

  const now = Date.now();
  return value >= now - DATE_MAX_PAST_MS && value <= now + DATE_MAX_FUTURE_MS;
}

/**
 * Clears the in-process dispatch limit. Used by tests.
 */
export function resetTelemetryDispatchWindow(): void {
  dispatchTimestamps.length = 0;
}

/**
 * Stops a tight loop from posting one event per call.
 * Ten accepted events are allowed per minute in this process.
 * @param {number} now Current epoch milliseconds
 * @returns {boolean} Whether this call may call fetch
 */
function allowDispatch(now: number): boolean {
  const cutoff = now - DISPATCH_WINDOW_MS;
  while (dispatchTimestamps.length > 0 && dispatchTimestamps[0] <= cutoff) {
    dispatchTimestamps.shift();
  }

  if (dispatchTimestamps.length >= MAX_DISPATCHES_PER_WINDOW) {
    return false;
  }

  dispatchTimestamps.push(now);
  return true;
}
