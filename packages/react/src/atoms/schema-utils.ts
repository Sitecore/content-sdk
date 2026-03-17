/** Schema metadata for atom props/events. */
import { z } from 'zod';

const META_KEY = 'meta';

/** Attach editor hint to a prop schema. @public */
export function withPropMeta<T extends z.ZodType>(schema: T, meta: import('./types').PropMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}

/** Attach display metadata to a custom event argument. @public */
export function withArgMeta<T extends z.ZodType>(schema: T, meta: import('./types').ArgMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}

/** Get field metadata from a Zod type or JSON Schema. @public */
export function getFieldMeta(
  schemaOrJsonSchema: z.ZodType | Record<string, unknown>
): Record<string, unknown> | undefined {
  if (typeof schemaOrJsonSchema === 'object' && schemaOrJsonSchema !== null && '_zod' in schemaOrJsonSchema) {
    const withMeta = schemaOrJsonSchema as Record<string, unknown> & {
      meta?: () => Record<string, unknown>;
    };
    const m = withMeta.meta?.();
    return m?.[META_KEY] as Record<string, unknown> | undefined;
  }
  return (schemaOrJsonSchema as Record<string, unknown>)[META_KEY] as
    | Record<string, unknown>
    | undefined;
}
