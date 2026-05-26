export const DEFAULT_CACHE_TTL = 300;

/**
 * Identity dimensions of a cache key. Derived from LoaderContext by buildCacheKey().
 * @public
 */
export interface CacheKeyDimensions {
  site: string;
  locale: string;
  variantId: string;
  loaderId: string;
  route: string;
}

/**
 * Resolved (fully defaulted) config used by every {@link LoaderCache}
 * implementation. Exported as `@internal` so sibling impls can share the same
 * shape and helper.
 *
 * Mirrors {@link GlobalLoaderCacheConfig} minus the construction-time `driver`
 * field — drivers are turned into a Storage instance in the factory before the
 * config reaches a backend.
 * @internal
 */
export interface ResolvedConfig {
  /** Default TTL in seconds; `0` or negative means "never expire". */
  revalidate: number;
  /** Master switch — when false, every call falls through to the raw loader. */
  enabled: boolean;
  /** Optional namespace prefix on cache keys (multi-app storage sharing). */
  namespace: string;
  /** Site name used by `invalidate({ route })` when no `site` is supplied. */
  defaultSiteName: string;
  /** Per-loader overrides keyed by loaderId. */
  loaders: Record<string, import('../../loaders/models').LoaderCacheConfig>;
}
