import { SITECORE_EDGE_PLATFORM_URL_DEFAULT } from '../../constants';

/**
 * Provisional Content SDK telemetry contract.
 *
 * The Edge Platform receiver is still a draft. These values follow that draft
 * for the parts the SDK can decide now:
 * - source `contentsdk`
 * - flat primitive `data` (SDK package versions are `<name>_version` strings)
 * - URL is the Edge Platform host plus `/telemetry/v1/events`
 *   (`SITECORE_EDGE_PLATFORM_HOSTNAME` selects the host)
 *
 * `destinations` is omitted. The receiver defaults `contentsdk` to Gainsight.
 * Gainsight credentials stay on the processor.
 */

/**
 * Source id the receiver expects for Content SDK.
 * @public
 */
export const TELEMETRY_SOURCE = 'contentsdk';

/**
 * Environment variable that disables telemetry when set to `1`, `true`, or `yes`.
 * Telemetry is on when the variable is unset.
 * @public
 */
export const TELEMETRY_DISABLED_ENV = 'SITECORE_TELEMETRY_DISABLED';

/**
 * Receiver URL used when `SITECORE_EDGE_PLATFORM_HOSTNAME` is unset.
 * @public
 */
export const DEFAULT_TELEMETRY_URL = `${SITECORE_EDGE_PLATFORM_URL_DEFAULT}/telemetry/v1/events`;

/**
 * How long dispatch waits for the receiver before giving up.
 * The caller is not failed when this elapses.
 * @public
 */
export const TELEMETRY_DISPATCH_TIMEOUT_MS = 1500;

/**
 * Values allowed in event `data`. Nested objects are not accepted.
 * @public
 */
export type TelemetryPrimitive = string | number | boolean;

/**
 * Flat event attributes. At most 32 keys. Strings at most 512 characters.
 * @public
 */
export type TelemetryData = Record<string, TelemetryPrimitive>;

/**
 * Anonymous client fingerprint required when the request has no auth token.
 * @public
 */
export type TelemetryFingerprint = {
  /** Published package name. Must be onboarded for `source`. */
  packageName: string;
  /** Package version string. No registry lookup is performed. */
  packageVersion: string;
  /** `platform/arch`, for example `darwin/arm64`. */
  os?: string;
  /** Runtime, for example `node/24.0.0`. */
  runtimeVersion?: string;
};

/**
 * Body posted to `POST /telemetry/v1/events`.
 * @public
 */
export type TelemetryEvent = {
  /** Onboarded source system, for example `contentsdk`. */
  source: string;
  /** Approved event name in snake_case. */
  name: string;
  /** Event attributes. */
  data: TelemetryData;
  /**
   * Unix epoch milliseconds.
   * Accepted when it is within 7 days in the past and 5 minutes in the future.
   * The receiver fills this in when it is omitted.
   */
  date?: number;
  /** Required for anonymous CLI and SDK calls. */
  fingerprint: TelemetryFingerprint;
};

/**
 * Overrides for a single dispatch. Environment variables still apply when a field is omitted.
 * @public
 */
export type DispatchTelemetryOptions = {
  /**
   * When `false`, skip the send. `SITECORE_TELEMETRY_DISABLED` also skips the send.
   */
  enabled?: boolean;
  /** Replaces the resolved URL for this call. */
  url?: string;
  /** Replaces {@link TELEMETRY_DISPATCH_TIMEOUT_MS} for this call. */
  timeoutMs?: number;
  /** Replaces global `fetch`. Used by tests. */
  fetchImpl?: typeof fetch;
};
