/**
 * Stable cache tag strings for Sitecore content (Next.js `cacheTag`, `unstable_cache` tags, `revalidateTag`).
 * Tags are deterministic for the same logical inputs so app code and invalidation webhooks stay aligned.
 * @public
 */
export const SITECORE_CONTENT_CACHE_TAG_PREFIX = 'sc';

/**
 * Sanitizes a single segment for use inside Sitecore cache tags.
 * Colons are reserved as delimiters; slashes and whitespace are normalized for stable keys.
 * @param {string} value - Raw segment (site name, locale, path segment, etc.).
 * @public
 */
export function sanitizeSitecoreCacheTagSegment(value: string): string {
  return value.trim().toLowerCase().replace(/[/:\s]+/g, '_');
}

/**
 * Normalizes a Sitecore item GUID for use in cache tags (lowercase, no braces).
 * @param {string} itemId - Sitecore item id or GUID string.
 * @public
 */
export function normalizeSitecoreItemIdForCacheTag(itemId: string): string {
  return itemId.trim().toLowerCase().replace(/[{}]/g, '');
}

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
 * @public
 */
export function buildSitecoreRouteCacheTag(params: BuildSitecoreRouteCacheTagParams): string {
  const site = sanitizeSitecoreCacheTagSegment(params.site);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  const segments = (params.pathSegments ?? []).map((s) => sanitizeSitecoreCacheTagSegment(s));
  const pathKey = segments.length > 0 ? segments.join('/') : '_';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:route:${site}:${locale}:${pathKey}`;
}

export type BuildSitecoreItemCacheTagParams = {
  itemId: string;
  locale: string;
  /**
   * Published version number, or omit / `undefined` for "latest" (no version in the key).
   */
  version?: number;
};

/**
 * Tag for a layout/route item (and anything else keyed the same way). Use for item-level invalidation.
 * @param {BuildSitecoreItemCacheTagParams} params - Item id, locale, and optional published version.
 * @public
 */
export function buildSitecoreItemCacheTag(params: BuildSitecoreItemCacheTagParams): string {
  const id = normalizeSitecoreItemIdForCacheTag(params.itemId);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  const ver =
    params.version !== undefined && Number.isFinite(params.version)
      ? `v${Math.trunc(params.version)}`
      : 'latest';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}:${ver}`;
}

export type BuildSitecoreDictionaryCacheTagParams = {
  site: string;
  locale: string;
};

/**
 * Tag for dictionary data scoped to site + locale.
 * @param {BuildSitecoreDictionaryCacheTagParams} params - Site and locale for the dictionary fetch.
 * @public
 */
export function buildSitecoreDictionaryCacheTag(params: BuildSitecoreDictionaryCacheTagParams): string {
  const site = sanitizeSitecoreCacheTagSegment(params.site);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:dict:${site}:${locale}`;
}

export type BuildSitecorePersonalizedPageVariantCacheTagParams = {
  /**
   * Primary personalization variant id from routing / `PageOptions.personalize`.
   */
  variantId: string;
  /**
   * Optional component-level variant ids (order is normalized for stability).
   */
  componentVariantIds?: string[];
};

/**
 * Tag for a personalized page variant so caches do not bleed across variants.
 * @param {BuildSitecorePersonalizedPageVariantCacheTagParams} params - Variant id and optional component variant ids.
 * @public
 */
export function buildSitecorePersonalizedPageVariantCacheTag(
  params: BuildSitecorePersonalizedPageVariantCacheTagParams
): string {
  const variant = sanitizeSitecoreCacheTagSegment(params.variantId);
  const extras = (params.componentVariantIds ?? [])
    .map((s) => sanitizeSitecoreCacheTagSegment(s))
    .filter(Boolean)
    .sort();
  const suffix = extras.length > 0 ? `:${extras.join('+')}` : '';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:pvv:${variant}${suffix}`;
}

export type SitecoreRouteDataLike = {
  itemId?: string;
  itemLanguage?: string;
  itemVersion?: number;
};

/**
 * Builds an item cache tag from layout route data when `itemId` is present.
 * Prefers `itemLanguage` from Sitecore when set; otherwise uses `fallbackLocale`.
 * @param {SitecoreRouteDataLike} route - Route data from layout (item id, language, version).
 * @param {string} fallbackLocale - Locale used when `route.itemLanguage` is not set.
 * @returns `null` when `route.itemId` is missing.
 * @public
 */
export function buildSitecoreItemCacheTagFromRouteData(
  route: SitecoreRouteDataLike,
  fallbackLocale: string
): string | null {
  if (!route.itemId) {
    return null;
  }
  const locale = route.itemLanguage
    ? sanitizeSitecoreCacheTagSegment(route.itemLanguage)
    : sanitizeSitecoreCacheTagSegment(fallbackLocale);
  const id = normalizeSitecoreItemIdForCacheTag(route.itemId);
  const ver =
    route.itemVersion !== undefined && Number.isFinite(route.itemVersion)
      ? `v${Math.trunc(route.itemVersion)}`
      : 'latest';
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}:${ver}`;
}

/**
 * Deduplicates tag strings while preserving first-seen order.
 * @param {string[]} tags - Tag strings possibly containing duplicates.
 * @public
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
