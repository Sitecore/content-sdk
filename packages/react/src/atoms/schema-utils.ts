/** Schema metadata for atom props/events. */
import { z } from 'zod';

/** Prop metadata (e.g. control hint for Design Studio). @public */
export type PropMeta = { control?: string };

/** Event argument metadata (e.g. argName). @public */
export type ArgMeta = { argName: string };

const META_KEY = 'meta';

/**
 * Attach editor hint (e.g. control type) to a prop schema. Metadata is stored under a key that
 * survives JSON Schema conversion for Design Studio.
 * @param {import('zod').ZodType} schema - Zod type for the prop
 * @param {PropMeta} meta - Editor metadata (e.g. control)
 * @returns The same Zod type with meta attached (or schema unchanged if .meta is not callable)
 * @public
 */
export function withPropMeta<T extends z.ZodType>(schema: T, meta: PropMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}

/**
 * Attach display metadata to a custom event argument (e.g. argName for DS). Stored under a key
 * that survives JSON Schema conversion.
 * @param {import('zod').ZodType} schema - Zod type for the argument
 * @param {ArgMeta} meta - Argument metadata
 * @returns The same Zod type with meta attached (or schema unchanged if .meta is not callable)
 * @public
 */
export function withArgMeta<T extends z.ZodType>(schema: T, meta: ArgMeta): T {
  const s = schema as unknown as { meta?: (m: Record<string, unknown>) => T };
  if (typeof s.meta === 'function') {
    return s.meta({ [META_KEY]: meta });
  }
  return schema;
}
