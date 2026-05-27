import type { LoaderContext } from '../../loaders/models';
import { CacheKeyDimensions } from './models';
import { dimensionsFromContext } from './utils';
import { sanitizeSitecoreCacheSegment } from './utils';
import { SITECORE_CONTENT_CACHE_TAG_PREFIX } from './cache-tags';

/** Prefix for OSR-aligned loader cache keys (`sc:loader:…`). @public */
export const CACHE_KEY_PREFIX = `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader`;

/**
 * Compose the canonical cache key for a loader invocation.
 * @public
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
 * @public
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

/** @public */
export function buildPageCacheKey(dimensions: CacheKeyDimensions): string {
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  const variantId = sanitizeSitecoreCacheSegment(dimensions.variantId);
  return `${CACHE_KEY_PREFIX}:page:${site}:${locale}:${variantId}:${dimensions.pathKey}`;
}

/** @public */
export function buildDictionaryCacheKey(dimensions: CacheKeyDimensions): string {
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  return `${CACHE_KEY_PREFIX}:dictionary:${site}:${locale}`;
}

/** @public */
export function buildGenericLoaderCacheKey(dimensions: CacheKeyDimensions): string {
  const loaderId = sanitizeSitecoreCacheSegment(dimensions.loaderId);
  const site = sanitizeSitecoreCacheSegment(dimensions.site);
  const locale = sanitizeSitecoreCacheSegment(dimensions.locale);
  const variantId = sanitizeSitecoreCacheSegment(dimensions.variantId);
  return `${CACHE_KEY_PREFIX}:${loaderId}:${site}:${locale}:${variantId}:${dimensions.pathKey}`;
}
