import { normalizePersonalizedRewrite } from '@sitecore-content-sdk/content/personalize';
import type { RouteData } from '@sitecore-content-sdk/content/layout';
import {
  buildSitecoreItemCacheTagFromRouteData,
  buildSitecoreRouteCacheTag,
  dedupeSitecoreCacheTags,
} from './sitecore-cache-tags';

/** @param {string} pathname - Raw pathname (may omit leading slash). */
function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim() || '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Trims leading and trailing `/` from a single path segment without regex (linear time; avoids ReDoS flags on path-derived input).
 * @param {string} part - One App Router catch-all path segment.
 */
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
   * Path string used for deriving normalized route segments (personalization rewrite segments stripped)
   * for the route tag. Provide this **or** `path`. When both are set, this value wins.
   */
  personalizedPathname?: string;
  /**
   * App Router catch-all segments (e.g. from `[...path]`). Used when `personalizedPathname` is omitted;
   * normalized the same way as `SitecoreClient.parsePath` for a string array argument.
   */
  path?: string[];
  /**
   * Route node from a Sitecore layout response (e.g. `page.layout.sitecore.route`, which is
   * `RouteData | null`). Optional because the page may not resolve; only `itemId`, `itemLanguage`,
   * and `itemVersion` are read when present.
   */
  route?: RouteData | null;
};

/**
 * Builds cache tags for a Sitecore page read (`getPage`): the route tag and the route's item tag.
 * Dictionary data is not part of `getPage`; tag dictionary fetches separately (for example with
 * `buildSitecoreDictionaryCacheTag` on a dedicated `use cache` helper).
 *
 * Registers **`sc:route:…`** and **`sc:item:…`** (when layout has `itemId`). Edge-style webhooks emit
 * item ids, which the Sitecore revalidate route handler maps to **`sc:item:…`**; route tags are only
 * invalidated when callers send the full `sc:route:…` strings in the `tags[]` array of the same revalidate request.
 *
 * Personalization variants are isolated naturally by URL path (each variant rewrite yields a distinct
 * Cache Components key) so no `sc:pvv:…` tag is added here. If a personalize-specific webhook is wired
 * up later, build that tag in the dedicated helper and add it on top of these.
 * @param {CollectSitecorePageCacheTagsParams} params - Site, locale, path or personalized pathname, and route metadata.
 * @public
 */
export function collectSitecorePageCacheTags(params: CollectSitecorePageCacheTagsParams): string[] {
  const pathnameInput =
    params.personalizedPathname !== undefined
      ? params.personalizedPathname
      : personalizedPathnameFromPathSegments(params.path ?? []);
  const pathname = normalizePathname(pathnameInput);
  const pathSegments = routeSegmentsFromPersonalizedPathname(pathname);

  return dedupeSitecoreCacheTags([
    buildSitecoreRouteCacheTag({
      site: params.site,
      locale: params.locale,
      pathSegments,
    }),
    buildSitecoreItemCacheTagFromRouteData(params.route, params.locale) ?? '',
  ]).filter(Boolean);
}
