/**
 * Same shape as packages/core/src/tools/telemetry/base-event.ts
 */
export type CSDKTelemetryEvent<Attributes = Record<string, unknown>> = {
  name: string;
  data: Attributes;
  date?: string | number | Date;
};

/**
 * JSON body for Gainsight PX REST **Create custom event** (`POST /v1/events/custom`).
 *
 * @see https://px-apidocs.gainsight.com/operation/operation-createcustomeventusingpost.md
 */
export type GainsightPxCustomEvent = {
  eventName: string;
  identifyId: string;
  /** Epoch time in milliseconds (OpenAPI `integer(int64)`). */
  date: number;
  eventId?: string;
  propertyKey?: string;
  eventType?: string;
  sessionId?: string;
  userType?: string;
  accountId?: string;
  globalContext?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  url?: string;
  referrer?: string;
  remoteHost?: string;
};
