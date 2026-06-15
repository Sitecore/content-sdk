import {
  defineAtomsCatalog as defineAtomsCatalogReact,
  defineAtomsRegistry as defineAtomsRegistryReact,
} from '@sitecore-content-sdk/react';

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
 * import { defineAtomsCatalog } from '@sitecore-content-sdk/nextjs';
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
export const defineAtomsCatalog = defineAtomsCatalogReact;

/**
 * Define an atoms registry that maps catalog definitions to Nextjs implementations.
 *
 * Each component receives `{ props, children, emit, on, bindings, loading }`
 * @param catalog - The catalog created by defineAtomsCatalog
 * @param options - Component and action implementations
 * @returns Registry result with component registry and action handlers
 * @example
 *
 * ```tsx
 * import { defineAtomsRegistry } from '@sitecore-content-sdk/nextjs';
 *
 * const { registry, handlers, executeAction } = defineAtomsRegistry(catalog, {
 *   components: {
 *     Button: ({ props, children, emit }) => (
 *       <button onClick={() => emit('press')}>{props.label}{children}</button>
 *     ),
 *     Card: ({ props, children }) => (
 *       <div className="card"><h2>{props.title}</h2>{children}</div>
 *     ),
 *   },
 *   actions: {
 *     submit: async (params) => {
 *       await fetch('/api/submit', { method: 'POST', body: JSON.stringify(params) });
 *     },
 *   },
 * });
 * ```
 * @public
 */
export const defineAtomsRegistry: typeof defineAtomsRegistryReact = defineAtomsRegistryReact;

