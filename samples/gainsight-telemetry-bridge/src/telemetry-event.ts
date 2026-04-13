/**
 * Same shape as packages/core/src/tools/telemetry/base-event.ts
 */
export type TelemetryEvent<Attributes = Record<string, unknown>> = {
  type: string;
  data: Attributes;
  date?: string | number | Date;
};
