import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react';
import type { AtomsCatalogInput } from './types';

/**
 * Define an atoms catalog from component and action definitions.
 *
 * Pass component/action definitions exactly as json-render expects them.
 * The returned catalog carries full type information so `defineAtomsRegistry`
 * can infer props per component.
 * @param {T} input - Catalog input with `components` and optionally `actions`
 * @returns A typed json-render Catalog
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { defineAtomsCatalog } from '@sitecore-content-sdk/react/atoms';
 *
 * const catalog = defineAtomsCatalog({
 *   components: {
 *     Button: {
 *       props: z.object({ label: z.string(), variant: z.enum(['primary', 'secondary']) }),
 *       description: 'A clickable button',
 *       slots: ['default'],
 *     },
 *     Card: {
 *       props: z.object({ title: z.string() }),
 *       description: 'A content card',
 *       slots: ['default'],
 *     },
 *   },
 *   actions: {
 *     submit: {
 *       params: z.object({ formId: z.string() }),
 *       description: 'Submit a form',
 *     },
 *   },
 * });
 * ```
 * @public
 */
export function defineAtomsCatalog<T extends AtomsCatalogInput>(input: T) {
  return defineCatalog(schema, input);
}
