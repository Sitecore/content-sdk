// export point for /node-tools submodule, which is not client-side safe and should not be imported in browser bundles
export * from './auth/models';
import * as authModule from './auth';

export * from './metadata';

export { ensurePathExists } from './ensurePath';

export {
  DEFAULT_TELEMETRY_URL,
  TELEMETRY_DISABLED_ENV,
  TELEMETRY_DISPATCH_TIMEOUT_MS,
  TELEMETRY_SOURCE,
  collectSdkPackageVersions,
  createTelemetryFingerprint,
  dispatchTelemetryEvent,
  isTelemetryEnabled,
  resolveTelemetryUrl,
  telemetryClient,
} from './telemetry';
export type {
  DispatchTelemetryOptions,
  TelemetryData,
  TelemetryEvent,
  TelemetryFingerprint,
  TelemetryPrimitive,
} from './telemetry';

/**
 * Preserve "live binding" semantics similar to ES module imports: production
 * code always sees the current implementation; tests can swap it safely and
 * restore via `sandbox.restore()` with no hidden global state.
 * @public
 */
export const auth: {
  readonly clientCredentialsFlow: typeof authModule.clientCredentialsFlow;
} = {} as any;

/*
 * Define an accessor so reads are dynamic
 *   - Production: returns the real `authModule.clientCredentialsFlow`.
 *   - Tests: can be replaced with a stub via `sinon.replaceGetter` or `sandbox.replaceGetter`
 */
Object.defineProperty(auth, 'clientCredentialsFlow', {
  get: () => authModule.clientCredentialsFlow,
  configurable: true,
  enumerable: true,
});
