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
  customTags?: string[];
}

/**
 * Resolved (fully defaulted) config used by every {@link LoaderCache}
 * implementation. Exported as `@internal` so sibling impls can share the same
 * shape and helper.
 * @internal
 */
export interface ResolvedConfig {
  revalidate: number;
  enabled: boolean;
}
