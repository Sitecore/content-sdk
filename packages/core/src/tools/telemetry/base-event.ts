export type TelemetryEvent<Attributes = unknown> = {
  name: string;
  data: Attributes;
  date?: Date;
};

export type TelemetryEventInitializer<Attributes = unknown> = (
  eventData?: Partial<Attributes>
) => TelemetryEvent<Attributes>;
