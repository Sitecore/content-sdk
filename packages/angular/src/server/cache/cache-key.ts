import type { LoaderContext } from '../../loaders/models';
import { CacheKeyDimensions } from './models';
import { dimensionsFromContext } from './utils';
import { sanitizeSitecoreCacheSegment } from './utils';
import { SITECORE_CONTENT_CACHE_TAG_PREFIX } from './cache-tags';

/** Prefix for OSR-aligned loader cache keys (`sc:loader:…`). @internal */
export const CACHE_KEY_PREFIX = `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader`;

/**
 * Compose the canonical cache key and dimension tuple for a loader invocation.
 * @param {string} loaderId - Registered loader id (`page`, `dictionary`, etc.).
 * @param {LoaderContext} ctx - Loader context (URL, route params, query).
 * @returns {{ key: string, dimensions: CacheKeyDimensions }} Cache key and parsed dimensions.
 * @example
 * ```ts
 * buildCacheKey('page', { url: '/about', params: { site: 'demo', locale: 'en' }, query: {} });
 * // → { key: 'sc:loader:page:demo:en:default:about', dimensions: { … } }
 * ```
 * @internal
 */
export function buildCacheKey(
  loaderId: string,
  ctx: LoaderContext
): { key: string; dimensions: CacheKeyDimensions } {
  const dimensions = dimensionsFromContext(loaderId, ctx);
  const key = serializeLoaderCacheKey(dimensions);
  return { key, dimensions };
}

/**
 * Serializes cache key dimensions into the public `sc:loader:…` format.
 * Dispatches to {@link buildPageCacheKey}, {@link buildDictionaryCacheKey}, or
 * {@link buildGenericLoaderCacheKey} based on `dimensions.loaderId`.
 * @param {CacheKeyDimensions} dimensions - Parsed cache key dimensions.
 * @returns {string} OSR-aligned cache key.
 * @internal
 */
export function serializeLoaderCacheKey(dimensions: CacheKeyDimensions): string {
  if (dimensions.loaderId === 'page') {
    return buildPageCacheKey(dimensions);
  }
  if (dimensions.loaderId === 'dictionary') {
    return buildDictionaryCacheKey(dimensions);
  }
  return buildGenericLoaderCacheKey(dimensions);
}

/**
 * Page loader key: `sc:loader:page:<site>:<locale>:<variantId>:<pathKey>`.
 * @param {CacheKeyDimensions} dimensions - Parsed cache key dimensions.
 * @returns {string} Page loader cache key.
 * @internal
 */
export function buildPageCacheKey(dimensions: CacheKeyDimensions): string {
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  const variantId = sanitizeSitecoreCacheSegment(dimensions.variantId);
  return `${CACHE_KEY_PREFIX}:page:${site}:${locale}:${variantId}:${dimensions.pathKey}`;
}

/**
 * Dictionary loader key: `sc:loader:dictionary:<site>:<locale>` (one entry per site/locale).
 * @param {CacheKeyDimensions} dimensions - Parsed cache key dimensions.
 * @returns {string} Dictionary loader cache key.
 * @internal
 */
export function buildDictionaryCacheKey(dimensions: CacheKeyDimensions): string {
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  return `${CACHE_KEY_PREFIX}:dictionary:${site}:${locale}`;
}

/**
 * Generic loader key: `sc:loader:<loaderId>:<site>:<locale>:<variantId>:<pathKey>`.
 * Used for loaders other than `page` and `dictionary` (for example `404`, `500`).
 * @param {CacheKeyDimensions} dimensions - Parsed cache key dimensions.
 * @returns {string} Generic loader cache key.
 * @internal
 */
export function buildGenericLoaderCacheKey(dimensions: CacheKeyDimensions): string {
  const loaderId = sanitizeSitecoreCacheSegment(dimensions.loaderId);
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  const variantId = sanitizeSitecoreCacheSegment(dimensions.variantId);
  return `${CACHE_KEY_PREFIX}:${loaderId}:${site}:${locale}:${variantId}:${dimensions.pathKey}`;
}
