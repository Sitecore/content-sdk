/** Schema metadata for atom props/events. */
import { z } from 'zod';

const META_KEY = 'meta';

/**
 * Attach editor hint (e.g. control type) to a prop schema. Metadata is stored under a key that
 * survives JSON Schema conversion for Design Studio.
 * @param schema - Zod type for the prop
 * @param meta - Editor metadata (e.g. control)
 * @returns The same Zod type with meta attached (or schema unchanged if .meta is not callable)
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
 * Attach display metadata to a custom event argument (e.g. argName for DS). Stored under a key
 * that survives JSON Schema conversion.
 * @param schema - Zod type for the argument
 * @param meta - Argument metadata
 * @returns The same Zod type with meta attached (or schema unchanged if .meta is not callable)
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
 * Get field metadata from a Zod type or a plain JSON Schema object. Uses _zod to detect Zod
 * types; otherwise reads the meta key from the object. For internal use by the renderer / DS.
 * @param schemaOrJsonSchema - Live Zod type or plain JSON Schema object
 * @returns The meta object or undefined
 * @internal
 */
export function getFieldMeta(
  schemaOrJsonSchema: z.ZodType | Record<string, unknown>
): Record<string, unknown> | undefined {
  if (typeof schemaOrJsonSchema !== 'object' || schemaOrJsonSchema === null) {
    return undefined;
  }
  if ('_zod' in schemaOrJsonSchema) {
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
