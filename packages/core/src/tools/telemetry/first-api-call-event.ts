import { TelemetryEventInitializer } from './base-event';
import { getSystemInformationData } from './system-info-event';

/** Env var: when set to any non-empty value, `sdk-first-api-call` telemetry is skipped. Set to `1` after a successful dispatch. */
export const CSDK_TELEMETRY_FIRST_API_CALL_ENV = 'CSDK_TELEMETRY_FIRST_API_CALL';

export const SDK_FIRST_API_CALL_EVENT_NAME = 'sdk-first-api-call';

export const SdkFirstApiCallEventInit =
  (): TelemetryEventInitializer<ReturnType<typeof getSystemInformationData>> =>
  () => ({
    name: SDK_FIRST_API_CALL_EVENT_NAME,
    data: getSystemInformationData(),
  });
