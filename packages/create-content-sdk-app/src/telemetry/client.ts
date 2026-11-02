import {
  APP_SCAFFOLDED_EVENT_NAME,
  TELEMETRY_SOURCE,
  createTelemetryFingerprint,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
} from '@sitecore-content-sdk/core/node-tools';

/**
 * Mutable client so tests can replace dispatch without touching the core package.
 */
export const telemetryClient = {
  APP_SCAFFOLDED_EVENT_NAME,
  TELEMETRY_SOURCE,
  createTelemetryFingerprint,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
};
