import type { RouteData } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
import {
  normalizeSitecoreItemIdForCacheKey,
  sanitizeSitecoreCacheSegment,
  dedupeCacheStrings,
} from './utils';
import type { CacheKeyDimensions } from './models';

/** Sitecore `sc:` namespace prefix for cache tags. */
export const SITECORE_CONTENT_CACHE_TAG_PREFIX = 'sc';

/**
 * Parameters for {@link buildSitecoreItemCacheTag}.
 * @internal
 */
export type BuildSitecoreItemCacheTagParams = {
  itemId: string;
  locale: string;
  version?: number;
};

/**
 * Tag for a layout/route item. Authority: `packages/nextjs/src/cache/sitecore-cache-tags.ts`.
 * @internal
 */
export function buildSitecoreItemCacheTag(params: BuildSitecoreItemCacheTagParams): string {
  const id = normalizeSitecoreItemIdForCacheKey(params.itemId);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  const ver =
    params.version !== undefined && Number.isFinite(params.version)
      ? `v${Math.trunc(params.version)}`
      : 'latest';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}:${ver}`;
}

/**
 * Tag for dictionary data scoped to site + locale.
 * Authority: `packages/nextjs/src/cache/sitecore-cache-tags.ts`.
 * @internal
 */
export function buildSitecoreDictionaryCacheTag(params: { site: string; locale: string }): string {
  const site = sanitizeSitecoreCacheSegment(params.site);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:${site}:${locale}`;
}

/**
 * Builds an item cache tag from layout route data when `itemId` is present.
 * Authority: `packages/nextjs/src/cache/sitecore-cache-tags.ts`.
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
  const ver =
    route.itemVersion !== undefined && Number.isFinite(route.itemVersion)
      ? `v${Math.trunc(route.itemVersion)}`
      : 'latest';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}:${ver}`;
}

/**
 * Builds loader-cache dictionary tags for webhook fan-out (`sc:loader:dictionary:…`).
 * @internal
 */
export function buildLoaderDictionaryCacheTagsFromSites(params: {
  sites: readonly { name: string; language?: string }[];
  baseLocale: string;
}): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const site of params.sites) {
    const locale = site.language?.trim() ? site.language : params.baseLocale;
    const tag = buildLoaderDictionaryCacheTag({ site: site.name, locale });
    if (!seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

/**
 * Cache key / self-tag for the dictionary loader.
 * @internal
 */
export function buildLoaderDictionaryCacheTag(params: { site: string; locale: string }): string {
  const site = sanitizeSitecoreCacheSegment(params.site);
  const locale = sanitizeSitecoreCacheSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:loader:dictionary:${site}:${locale}`;
}

/**
 * Site-wide fan-out tag.
 * @internal
 */
export function buildSitecoreSiteCacheTag(site: string): string {
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:site:${sanitizeSitecoreCacheSegment(site)}`;
}

/**
 * Locale-wide fan-out tag.
 * @internal
 */
export function buildSitecoreLocaleCacheTag(locale: string): string {
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:locale:${sanitizeSitecoreCacheSegment(locale)}`;
}

/**
 * Builds the tag set written alongside a loader cache entry (Phase 3 OSR alignment).
 * Includes self-key, site, locale, item (page loader), and Next.js-compatible dict tag.
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

function buildPageItemTag(value: unknown, fallbackLocale: string): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const page = value as Page;
  return buildSitecoreItemCacheTagFromRouteData(page.layout?.sitecore?.route, fallbackLocale);
}
