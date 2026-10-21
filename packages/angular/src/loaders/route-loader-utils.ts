import type { Params, Route } from '@angular/router';
import { LOADER_ID } from './loader-registry.token';

/**
 * Resolver function shape used in route config (minimal for LOADER_ID detection).
 * @internal
 */
interface ResolverWithLoaderId {
  [key: symbol]: string;
}

/**
 * Returns the loader ID tagged onto a resolver function by {@link loaderResolver}, or
 * `undefined` when `resolver` is not a loader resolver (e.g. an ordinary Angular `ResolveFn`).
 * @param {unknown} resolver - A single entry from a `Route.resolve` map.
 * @returns {string | undefined} The loader ID, or `undefined`.
 * @internal
 */
export function getLoaderId(resolver: unknown): string | undefined {
  if (
    typeof resolver === 'function' &&
    LOADER_ID in resolver &&
    typeof (resolver as unknown as ResolverWithLoaderId)[LOADER_ID] === 'string'
  ) {
    return (resolver as unknown as ResolverWithLoaderId)[LOADER_ID];
  }
  return undefined;
}

/**
 * Walks an ordered (parent → child) list of `Route.resolve` maps and returns every loader ID
 * tagged via {@link loaderResolver}. Order-preserving; does not dedupe — callers pass the
 * result straight to `ClientLoaderDataService.prefetch()`, which already dedupes by
 * `(loaderId, url)`.
 * @param {(Route['resolve'] | undefined)[]} resolveConfigs - `resolve` maps from each matched route level, root to leaf.
 * @returns {string[]} Loader IDs found across all levels.
 * @internal
 */
export function collectLoaderIds(resolveConfigs: (Route['resolve'] | undefined)[]): string[] {
  const loaderIds: string[] = [];
  for (const resolveConfig of resolveConfigs) {
    if (!resolveConfig) continue;
    for (const resolver of Object.values(resolveConfig)) {
      const loaderId = getLoaderId(resolver);
      if (loaderId) {
        loaderIds.push(loaderId);
      }
    }
  }
  return loaderIds;
}

/**
 * Merges params from an ordered (root → leaf) list of route param sets and defaults `locale`
 * from `defaultLanguage` when no level contributed one. Loaders always see a concrete
 * `params.locale` whether or not the locale matcher captured one from the URL.
 * @param {Params[]} paramsChain - Params contributed by each matched route level, root to leaf.
 * @param {string} [defaultLanguage] - Default language to fall back to.
 * @returns {Params} Merged params with a guaranteed `locale` when `defaultLanguage` is set.
 */
export function mergeRouteParams(paramsChain: Params[], defaultLanguage?: string): Params {
  const merged = paramsChain.reduce((acc, params) => ({ ...acc, ...params }), {} as Params);
  if (!merged.locale && defaultLanguage) {
    merged.locale = defaultLanguage;
  }
  return merged;
}
