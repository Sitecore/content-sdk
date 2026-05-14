import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/content/personalize';
import {
  buildSitecoreItemCacheTagFromRouteData,
  buildSitecorePersonalizedPageVariantCacheTag,
  buildSitecoreRouteCacheTag,
  dedupeSitecoreCacheTags,
  type SitecoreRouteDataLike,
} from './sitecore-cache-tags';

/** @param {string} pathname - Raw pathname (may omit leading slash). */
function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim() || '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Trim leading and trailing `/` without regex (linear time; avoids ReDoS flags on path-derived input). */
function trimSlashes(part: string): string {
  let start = 0;
  let end = part.length;
  while (start < end && part[start] === '/') {
    start++;
  }
  while (end > start && part[end - 1] === '/') {
    end--;
  }
  return part.slice(start, end);
}

/**
 * Normalizes App Router catch-all `path` segments the same way as `SitecoreClient.parsePath` for a
 * string array (leading slash, trim segments, drop empty `/` parts).
 * @param {string[]} path - App Router catch-all segments.
 */
function personalizedPathnameFromPathSegments(path: string[]): string {
  if (path.length === 0) {
    return '/';
  }
  return `/${path
    .filter((part) => part !== '/')
    .map((part) => trimSlashes(part))
    .join('/')}`;
}

/**
 * Route segments after removing personalization rewrite markers, for stable route-level tags.
 * @param {string} personalizedPathname - Pathname that may include personalization rewrite segments.
 */
function routeSegmentsFromPersonalizedPathname(personalizedPathname: string): string[] {
  const pathname = normalizePathname(personalizedPathname);
  const n = normalizePersonalizedRewrite(pathname);
  if (!n || n === '/') {
    return [];
  }
  const noLead = n.startsWith('/') ? n.slice(1) : n;
  return noLead.split('/').filter(Boolean);
}

/**
 * Inputs for assembling cache tags for a typical Sitecore page render (`getPage`).
 * @public
 */
export type CollectSitecorePageCacheTagsParams = {
  site: string;
  locale: string;
  /**
   * Path string used for personalization rewrite parsing (`_variantId_...`) and for deriving
   * normalized route segments (variants stripped) for the route tag.
   * Provide this **or** `path`. When both are set, this value wins.
   */
  personalizedPathname?: string;
  /**
   * App Router catch-all segments (e.g. from `[...path]`). Used when `personalizedPathname` is omitted;
   * normalized the same way as `SitecoreClient.parsePath` for a string array argument.
   */
  path?: string[];
  /** Route node from layout (for item id / language / version). */
  route: SitecoreRouteDataLike;
};

/**
 * Builds cache tags for a Sitecore page read (`getPage`): route, personalization variant, and route item.
 * Dictionary data is not part of `getPage`; tag dictionary fetches separately (for example with
 * `buildSitecoreDictionaryCacheTag` on a dedicated `use cache` helper).
 * Registers **`sc:route:…`**, **`sc:pvv:…`**, and **`sc:item:…`** (when layout has `itemId`). Edge-style webhooks usually emit item ids, which map to **`sc:item:…`** via {@link collectSitecoreTagsFromEdgeRevalidateRequestBody}; route and variant tags are only invalidated from webhooks if passed as full `sc:` strings in `tags`, or via manual revalidate.
 * @param {CollectSitecorePageCacheTagsParams} params - Site, locale, path or personalized pathname, and route metadata.
 * @public
 */
export function collectSitecorePageCacheTags(params: CollectSitecorePageCacheTagsParams): string[] {
  const pathnameInput =
    params.personalizedPathname !== undefined
      ? params.personalizedPathname
      : personalizedPathnameFromPathSegments(params.path ?? []);
  const pathname = normalizePathname(pathnameInput);
  const personalize = getPersonalizedRewriteData(pathname);
  const pathSegments = routeSegmentsFromPersonalizedPathname(pathname);

  return dedupeSitecoreCacheTags([
    buildSitecoreRouteCacheTag({
      site: params.site,
      locale: params.locale,
      pathSegments,
    }),
    buildSitecorePersonalizedPageVariantCacheTag({
      variantId: personalize.variantId,
      componentVariantIds: personalize.componentVariantIds,
    }),
    buildSitecoreItemCacheTagFromRouteData(params.route, params.locale) ?? '',
  ]).filter(Boolean);
}
