import {
  LoaderCacheConfig,
  LoaderCacheReadResult,
  LoaderCacheEntry,
  LoaderContext,
} from '../../loaders/models';
import { GlobalLoaderCacheConfig, CacheKeyDimensions, DEFAULT_CACHE_TTL } from './models';

/**
 * Approximate serialized byte size of a cache value (demo/admin helper).
 * Only used for demo purposes. Remove before release.
 * TODO: Remove before release.
 * @param {unknown} value - Value to measure.
 * @returns {number} JSON string length, or `0` when serialization fails.
 */
export function approxByteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}

/**
 * Removes the query string from a URL path.
 * @param {string} url - URL or path that may include `?query`.
 * @returns {string} Pathname without query string.
 * @internal
 */
function stripQuery(url: string): string {
  const i = url.indexOf('?');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Converts a loader URL to the `pathKey` segment used in OSR-aligned cache keys.
 * Strips query strings, trims slashes, sanitizes segments, and removes a leading
 * locale prefix when it matches `params.locale`. Home resolves to `'_'`.
 * @param {string} url - Loader URL (may include query string).
 * @param {string} [locale] - Optional locale used to strip a leading `/locale` prefix.
 * @returns {string} Sanitized path key (`'_'` for home).
 * @example
 * ```ts
 * urlToPathKey('/'); // '_'
 * urlToPathKey('/About Us'); // 'about_us'
 * urlToPathKey('/en/about', 'en'); // 'about'
 * ```
 * @internal
 */
export function urlToPathKey(url: string, locale?: string): string {
  const pathname = stripQuery(url || '/').replace(/^\/+|\/+$/g, '');
  let segments = pathname ? pathname.split('/').filter(Boolean) : [];
  if (locale && segments[0]?.toLowerCase() === locale.toLowerCase()) {
    segments = segments.slice(1);
  }
  if (segments.length === 0) {
    return '_';
  }
  return segments.map((segment) => sanitizeSitecoreCacheSegment(segment)).join('/');
}

/**
 * Derives {@link CacheKeyDimensions} from a loader context.
 * Used by {@link buildCacheKey} and admin tooling.
 * @param {string} loaderId - Loader id being resolved.
 * @param {LoaderContext} ctx - Loader context (URL + route params).
 * @returns {CacheKeyDimensions} Parsed cache key dimensions.
 * @internal
 */
export function dimensionsFromContext(loaderId: string, ctx: LoaderContext): CacheKeyDimensions {
  const params = (ctx.params ?? {}) as Record<string, unknown>;
  const site = (params?.site as string) || 'default';
  const locale = (params?.locale as string) || 'en';
  const pathKey = urlToPathKey(ctx.url || '/', locale);

  return {
    site,
    locale,
    variantId: 'default',
    loaderId,
    pathKey,
  };
}

/**
 * Strips `driver` from {@link GlobalLoaderCacheConfig} before passing config to backends.
 * @param {GlobalLoaderCacheConfig} config - Global cache config from {@link createLoaderCache}.
 * @returns {LoaderCacheConfig} Backend-safe config without the unstorage driver instance.
 * @internal
 */
export function resolveConfig(config: GlobalLoaderCacheConfig): LoaderCacheConfig {
  const clonedConfig = { ...config };
  delete clonedConfig.driver;
  return clonedConfig;
}

/**
 * Applies defaults for every {@link LoaderCacheConfig} field.
 * @param {LoaderCacheConfig} [config] - Partial config from `createLoaderCache()` or a backend constructor.
 * @returns {Required<LoaderCacheConfig>} Fully populated config used by cache backends.
 * @internal
 */
export function applyLoaderCacheConfigDefaults(
  config: LoaderCacheConfig = {}
): Required<LoaderCacheConfig> {
  return {
    revalidate: config.revalidate ?? DEFAULT_CACHE_TTL,
    enabled: config.enabled ?? true,
    defaultSiteName: config.defaultSiteName ?? 'default',
    tags: config.tags ?? [],
    sites: config.sites ?? [],
    defaultLocale: config.defaultLocale ?? 'en',
  };
}

/**
 * Maps a stored entry to the three-outcome read result used by {@link ServerLoaderRunner} (Phase 3 SWR).
 * @param {string} cacheKey - Key being read.
 * @param {LoaderCacheEntry | null | undefined} entry - Stored entry, if any.
 * @param {number} [now] - Current timestamp for TTL comparison (defaults to `Date.now()`).
 * @returns {LoaderCacheReadResult} Hit, stale, or miss classification.
 * @internal
 */
export function evaluateCacheRead(
  cacheKey: string,
  entry: LoaderCacheEntry | null | undefined,
  now = Date.now()
): LoaderCacheReadResult {
  if (!entry) {
    return { kind: 'miss', cacheKey };
  }
  if (entry.stale || (entry.expiresAt !== null && entry.expiresAt <= now)) {
    return { kind: 'stale', value: entry.value, cacheKey };
  }
  return { kind: 'hit', value: entry.value, cacheKey };
}

/**
 * Sanitizes a segment for Sitecore cache keys and tags (lowercase, separators → `_`).
 * @param {string} value - Raw segment from site, locale, path, or loader id.
 * @returns {string} Sanitized segment safe for keys and tags.
 * @internal
 */
export function sanitizeSitecoreCacheSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[/:\s]+/g, '_');
}

/**
 * Normalizes a Sitecore item GUID for cache keys/tags (lowercase, no braces).
 * @param {string} itemId - Raw Sitecore item id or GUID.
 * @returns {string} Normalized id segment.
 * @internal
 */
export function normalizeSitecoreItemIdForCacheKey(itemId: string): string {
  return itemId.trim().toLowerCase().replace(/[{}]/g, '');
}

/**
 * Deduplicates strings while preserving first-seen order.
 * @param {string[]} values - Tag or key candidates.
 * @returns {string[]} Deduplicated list.
 * @internal
 */
export function dedupeCacheStrings(values: string[]): string[] {
  const dedupedSet = new Set<string>(values);
  return Array.from(dedupedSet);
}
