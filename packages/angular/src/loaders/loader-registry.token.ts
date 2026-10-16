import { InjectionToken, Provider } from '@angular/core';
import type { LoaderDefinition, LoaderFinalizer, LoaderFn } from './models';

/**
 * Optional endpoint path for loader data fetch (e.g. '/_data' or '/api/data').
 * When null or undefined, LOADER_DATA_ENDPOINT is used.
 * @public
 */
export const FETCH_DATA_ENDPOINT = new InjectionToken<string | null | undefined>(
  'FETCH_DATA_ENDPOINT'
);

/**
 * Cross-boundary loader registry — maps loader IDs to {@link LoaderDefinition}
 * entries (functions or `{ load, finalize? }` descriptors).
 * The same registry is used for SSR, CSR (`/_data`), and route resolvers.
 * Widening from `Record<string, LoaderFn>` is source-compatible for
 * constructors; do not invoke entries as `registry[id](ctx)`.
 * @public
 */
export type LoaderRegistry = Record<string, LoaderDefinition>;

/**
 * Normalizes a registry entry so callers do not invoke `registry[id](ctx)`
 * directly after the public type widening.
 * @param {LoaderDefinition | undefined} definition Registry entry
 * @returns {{ load: LoaderFn; finalize?: LoaderFinalizer } | undefined} Normalized definition
 * @public
 */
export function resolveLoaderDefinition(
  definition?: LoaderDefinition
): { load: LoaderFn; finalize?: LoaderFinalizer } | undefined {
  if (!definition) {
    return undefined;
  }
  if (typeof definition === 'function') {
    return { load: definition };
  }
  return definition;
}

export const LOADER_REGISTRY = new InjectionToken<LoaderRegistry>('LOADER_REGISTRY');

/**
 * Registers the app's loader registry for DI. Pass the loaders your app uses
 * (e.g. page, '404', '500'). Use the **same object** with
 * createLoaderDataServiceMiddleware in `server.ts` so SSR and CSR
 * navigations resolve the same loader definitions (`LoaderFn` or
 * `{ load, finalize }`).
 * @param {LoaderRegistry} loaders - Map of loader id to loader definition
 * @public
 */
export const provideLoaderRegistry = (loaders: LoaderRegistry): Provider[] => {
  return [
    {
      provide: LOADER_REGISTRY,
      useValue: { ...loaders },
    },
  ];
};

/**
 * Symbol used to tag resolver functions with their loader ID.
 * This allows the prefetch service to identify loader resolvers in the route tree.
 * @internal
 */
export const LOADER_ID = Symbol('loaderId');
