/**
 * Schema metadata utilities for atom props and event arguments.
 * Used when TypeScript cannot enforce the metadata (e.g. editor control type,
 * argument display names); the metadata survives JSON Schema conversion for DS.
 */
import { z } from 'zod';

const META_KEY = 'meta';

/**
 * Attaches editor hints to a Zod field (e.g. control type).
 * Stored under the meta key so it survives JSON Schema conversion.
 * @param {z.ZodType} schema - Zod type for the prop
 * @param {import('./types').PropMeta} meta - Editor metadata (e.g. control: "text" | "color")
 * @returns {T} The same Zod type with meta attached
 * @public
 */
export function withPropMeta<T extends z.ZodType>(schema: T, meta: import('./types').PropMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}

/**
 * Attaches display metadata to a custom event argument.
 * Stored under the meta key so it survives JSON Schema conversion.
 * @param {z.ZodType} schema - Zod type for the argument
 * @param {import('./types').ArgMeta} meta - Argument metadata (e.g. argName for DS event binding UI)
 * @returns {T} The same Zod type with meta attached
 * @public
 */
export function withArgMeta<T extends z.ZodType>(schema: T, meta: import('./types').ArgMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}

/**
 * Retrieves field metadata from a Zod type or a converted JSON Schema object.
 * Works for both prop metadata and argument metadata (same meta key).
 * @param {z.ZodType | Record<string, unknown>} schemaOrJsonSchema - Live Zod type or plain JSON Schema object
 * @returns {Record<string, unknown> | undefined} The meta object or undefined
 * @public
 */
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
