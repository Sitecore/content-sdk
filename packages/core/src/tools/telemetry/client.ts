import { TELEMETRY_SOURCE } from './models';
import {
  createTelemetryFingerprint,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
  resolveTelemetryUrl,
} from './dispatch';
import { collectSdkPackageVersions } from './versions';

/**
 * Telemetry calls grouped so another package can replace one method in tests.
 * @public
 */
export const telemetryClient = {
  TELEMETRY_SOURCE,
  createTelemetryFingerprint,
  collectSdkPackageVersions,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
  resolveTelemetryUrl,
};
