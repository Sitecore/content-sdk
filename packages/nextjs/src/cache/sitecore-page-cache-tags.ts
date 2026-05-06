import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/content/personalize';
import {
  buildSitecoreDictionaryCacheTag,
  buildSitecoreItemCacheTagFromRouteData,
  buildSitecorePersonalizedPageVariantCacheTag,
  buildSitecoreRouteCacheTag,
  dedupeSitecoreCacheTags,
  type SitecoreRouteDataLike,
} from './sitecore-cache-tags';

function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim() || '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Route segments after removing personalization rewrite markers, for stable route-level tags.
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
   */
  personalizedPathname: string;
  /** Route node from layout (for item id / language / version). */
  route: SitecoreRouteDataLike;
};

/**
 * Builds the full tag set for a Sitecore page read: route, dictionary, personalization variant, and route item.
 * @param {CollectSitecorePageCacheTagsParams} params - Site, locale, pathname, and route metadata.
 * @public
 */
export function collectSitecorePageCacheTags(params: CollectSitecorePageCacheTagsParams): string[] {
  const pathname = normalizePathname(params.personalizedPathname);
  const personalize = getPersonalizedRewriteData(pathname);
  const pathSegments = routeSegmentsFromPersonalizedPathname(pathname);

  return dedupeSitecoreCacheTags([
    buildSitecoreRouteCacheTag({
      site: params.site,
      locale: params.locale,
      pathSegments,
    }),
    buildSitecoreDictionaryCacheTag({ site: params.site, locale: params.locale }),
    buildSitecorePersonalizedPageVariantCacheTag({
      variantId: personalize.variantId,
      componentVariantIds: personalize.componentVariantIds,
    }),
    buildSitecoreItemCacheTagFromRouteData(params.route, params.locale) ?? '',
  ]).filter(Boolean);
}
