'use client';
import { defineRegistry } from '@json-render/react';

/**
 * Define an atoms registry that maps catalog definitions to React implementations.
 *
 * Each component receives `{ props, children, emit, on, bindings, loading }`
 * @param catalog - The catalog created by defineAtomsCatalog
 * @param options - Component and action implementations
 * @returns Registry result with component registry and action handlers
 * @example
 *
 * ```tsx
 * import { defineAtomsRegistry } from '@sitecore-content-sdk/react/atoms';
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
export const defineAtomsRegistry: typeof defineRegistry = defineRegistry;
