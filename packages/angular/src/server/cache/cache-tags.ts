import type { RouteData } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
import {
  normalizeSitecoreItemIdForCacheKey,
  sanitizeSitecoreCacheSegment,
  dedupeCacheStrings,
} from './utils';
import type { CacheKeyDimensions } from './models';

/**
 * Sitecore OSR namespace prefix shared with other frameworks (`sc:`).
 * All loader cache keys and invalidation tags use this prefix.
 * @internal
 */
export const SITECORE_CONTENT_CACHE_TAG_PREFIX = 'sc';

/**
 * Parameters for {@link buildSitecoreItemCacheTag}.
 * @internal
 */
export type BuildSitecoreItemCacheTagParams = {
  /** Sitecore item GUID or content id. */
  itemId: string;
  /** Locale/culture for the item tag. */
  locale: string;
};

/**
 * Builds an item-scoped revalidation tag: `sc:item:<id>:<locale>`.
 * @param {BuildSitecoreItemCacheTagParams} params - Item id and locale.
 * @returns {string} Sitecore item cache tag.
 * @internal
 */
export function buildSitecoreItemCacheTag(params: BuildSitecoreItemCacheTagParams): string {
  const id = normalizeSitecoreItemIdForCacheKey(params.itemId);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}`;
}

/**
 * Parameters for {@link buildSitecoreDictionaryCacheTag} and related dictionary tag helpers.
 * @internal
 */
export type SitecoreDictionaryCacheTagParams = {
  /** Site name segment. */
  site: string;
  /** Locale segment. */
  locale: string;
};

/**
 * Builds a dictionary cache tag: `sc:dict:<site>:<locale>`.
 * Used for dictionary loader entries and cross-stack webhook fan-out.
 * @param {SitecoreDictionaryCacheTagParams} params - Site and locale segments.
 * @returns {string} Dictionary cache tag.
 * @internal
 */
export function buildSitecoreDictionaryCacheTag(params: SitecoreDictionaryCacheTagParams): string {
  const site = sanitizeSitecoreCacheSegment(params.site);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:${site}:${locale}`;
}

/**
 * Builds an item tag from layout route data when `itemId` is present.
 * Returns `null` when the route has no item id (non-content routes).
 * @param {RouteData | null | undefined} route - Layout route metadata.
 * @param {string} fallbackLocale - Locale used when `route.itemLanguage` is absent.
 * @returns {string | null} Item cache tag, or `null` when no item id is available.
 * @internal
 */
export function buildSitecoreItemCacheTagFromRouteData(
  route: RouteData | null | undefined,
  fallbackLocale: string
): string | null {
  if (!route?.itemId) {
    return null;
  }
  const locale = route.itemLanguage
    ? sanitizeSitecoreCacheSegment(route.itemLanguage)
    : sanitizeSitecoreCacheSegment(fallbackLocale);
  const id = normalizeSitecoreItemIdForCacheKey(route.itemId);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}`;
}

/**
 * Loader-cache self-tag for the dictionary loader: `sc:loader:dictionary:<site>:<locale>`.
 * @param {SitecoreDictionaryCacheTagParams} params - Site and locale segments.
 * @returns {string} Loader dictionary self-tag (same shape as the cache key).
 * @internal
 */
export function buildLoaderDictionaryCacheTag(params: SitecoreDictionaryCacheTagParams): string {
  const site = sanitizeSitecoreCacheSegment(params.site);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader:dictionary:${site}:${locale}`;
}

/**
 * Site-wide fan-out tag: `sc:site:<site>`.
 * Invalidating this tag marks every cached entry for the site stale.
 * @param {string} site - Site name segment.
 * @returns {string} Site fan-out cache tag.
 * @internal
 */
export function buildSitecoreSiteCacheTag(site: string): string {
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:site:${sanitizeSitecoreCacheSegment(site)}`;
}

/**
 * Locale-wide fan-out tag: `sc:locale:<locale>`.
 * @param {string} locale - Locale segment.
 * @returns {string} Locale fan-out cache tag.
 * @internal
 */
export function buildSitecoreLocaleCacheTag(locale: string): string {
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:locale:${sanitizeSitecoreCacheSegment(locale)}`;
}

/**
 * Builds the full tag set written alongside a loader cache entry.
 * Always includes self-tag, `sc:site:<site>`, and `sc:locale:<locale>`. Conditionally adds
 * `sc:item:…` for page loaders and `sc:dict:…` for dictionary loaders. Custom tags are deduped.
 * @param {string} loaderId - Loader that produced the value.
 * @param {CacheKeyDimensions} dimensions - Key dimensions from {@link buildCacheKey}.
 * @param {string} cacheKey - Stored cache key (also used as a self-tag).
 * @param {unknown} [loaderValue] - Loader payload (page layout is inspected for item tags).
 * @param {string[]} [customTags] - Optional per-route tags from `loaderResolver(id, { tags })`.
 * @returns {string[]} Tag set to persist with the cache entry.
 * @internal
 */
export function buildLoaderCacheTags(
  loaderId: string,
  dimensions: CacheKeyDimensions,
  cacheKey: string,
  loaderValue?: unknown,
  customTags: string[] = []
): string[] {
  const tags: string[] = [
    cacheKey,
    buildSitecoreSiteCacheTag(dimensions.site),
    buildSitecoreLocaleCacheTag(dimensions.locale),
    ...customTags,
  ];

  if (loaderId === 'page') {
    const itemTag = buildPageItemTag(loaderValue, dimensions.locale);
    if (itemTag) {
      tags.push(itemTag);
    }
  }

  if (loaderId === 'dictionary') {
    tags.push(
      buildSitecoreDictionaryCacheTag({ site: dimensions.site, locale: dimensions.locale })
    );
  }

  return dedupeCacheStrings(tags);
}

/**
 * Extracts a page item tag from a loader payload when layout route data is present.
 * @param {unknown} value - Loader result (expected to be a page shape).
 * @param {string} fallbackLocale - Locale used when route language is absent.
 * @returns {string | null} Item cache tag, or `null` when no item id is available.
 * @internal
 */
function buildPageItemTag(value: unknown, fallbackLocale: string): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const page = value as Page;
  return buildSitecoreItemCacheTagFromRouteData(page.layout?.sitecore?.route, fallbackLocale);
}
