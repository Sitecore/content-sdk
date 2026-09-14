import type { RouteData } from '@sitecore-content-sdk/content/layout';

/**
 * Stable cache tag strings for Sitecore content (Next.js `cacheTag`, `unstable_cache` tags, `revalidateTag`).
 * Tags are deterministic for the same logical inputs so app code and invalidation webhooks stay aligned.
 * @internal
 */
export const SITECORE_CONTENT_CACHE_TAG_PREFIX = 'sc';

/**
 * Sanitizes a single segment for use inside Sitecore cache tags.
 * Colons are reserved as delimiters; slashes and whitespace are normalized for stable keys.
 * @param {string} value - Raw segment (site name, locale, path segment, etc.).
 * @internal
 */
export function sanitizeSitecoreCacheTagSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[/:\s]+/g, '_');
}

/**
 * Normalizes a Sitecore item GUID for use in cache tags.
 * Lowercases, strips braces, and canonicalizes 32-character hex GUIDs to hyphenated form
 * so layout-service ids (`{guid}`) and Experience Edge identifiers (`GUID` without hyphens)
 * produce the same `sc:item:` tag.
 * @param {string} itemId - Sitecore item id or GUID string.
 * @internal
 */
export function normalizeSitecoreItemIdForCacheTag(itemId: string): string {
  const cleaned = itemId.trim().toLowerCase().replace(/[{}]/g, '');
  const hex = cleaned.replace(/-/g, '');
  if (/^[0-9a-f]{32}$/.test(hex)) {
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return cleaned;
}

/**
 * Parameters for {@link buildSitecoreRouteCacheTag}.
 * @internal
 */
export type BuildSitecoreRouteCacheTagParams = {
  site: string;
  locale: string;
  /**
   * Path segments after site/locale (e.g. `['about']` or `['products', 'sku-1']`).
   * Empty or omitted means the site home route for that locale.
   */
  pathSegments?: string[];
};

/**
 * Tag for a resolved route (site + language + logical path). Use for URL-level invalidation.
 * @param {BuildSitecoreRouteCacheTagParams} params - Site, locale, and optional path segments.
 * @internal
 */
export function buildSitecoreRouteCacheTag(params: BuildSitecoreRouteCacheTagParams): string {
  const site = sanitizeSitecoreCacheTagSegment(params.site);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  const segments = (params.pathSegments ?? []).map((s) => sanitizeSitecoreCacheTagSegment(s));
  const pathKey = segments.length > 0 ? segments.join('/') : '_';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:${site}:${locale}:${pathKey}`;
}

/**
 * Parameters for {@link buildSitecoreItemCacheTag}.
 * @internal
 */
export type BuildSitecoreItemCacheTagParams = {
  itemId: string;
  locale: string;
};

/**
 * Tag for a layout/route item (and anything else keyed the same way). Use for item-level invalidation.
 * @param {BuildSitecoreItemCacheTagParams} params - Item id and locale.
 * @internal
 */
export function buildSitecoreItemCacheTag(params: BuildSitecoreItemCacheTagParams): string {
  const id = normalizeSitecoreItemIdForCacheTag(params.itemId);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}`;
}

/**
 * Parameters for {@link buildSitecoreDictionaryCacheTag}.
 * @public
 */
export type BuildSitecoreDictionaryCacheTagParams = {
  site: string;
  locale: string;
};

/**
 * Tag for dictionary data scoped to site + locale.
 * @param {BuildSitecoreDictionaryCacheTagParams} params - Site and locale for the dictionary fetch.
 * @public
 */
export function buildSitecoreDictionaryCacheTag(
  params: BuildSitecoreDictionaryCacheTagParams
): string {
  const site = sanitizeSitecoreCacheTagSegment(params.site);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:${site}:${locale}`;
}

/**
 * Builds an item cache tag from Sitecore layout route data when `itemId` is present.
 * Prefers `itemLanguage` from Sitecore when set; otherwise uses `fallbackLocale`.
 * Accepts the same `RouteData` shape returned by the layout service (e.g. `page.layout.sitecore.route`,
 * which is `RouteData | null`) or `undefined` when the page did not resolve.
 * @param {RouteData | null | undefined} route - Route node from layout (item id and language).
 * @param {string} fallbackLocale - Locale used when `route.itemLanguage` is not set.
 * @returns `null` when `route` is missing or `route.itemId` is not set.
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
    ? sanitizeSitecoreCacheTagSegment(route.itemLanguage)
    : sanitizeSitecoreCacheTagSegment(fallbackLocale);
  const id = normalizeSitecoreItemIdForCacheTag(route.itemId);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}`;
}

/**
 * Deduplicates tag strings while preserving first-seen order.
 * @param {string[]} tags - Tag strings possibly containing duplicates.
 * @internal
 */
export function dedupeSitecoreCacheTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}
