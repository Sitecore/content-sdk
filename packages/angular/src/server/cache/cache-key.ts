import type { LoaderContext } from '../../loaders/models';
import { CacheKeyDimensions } from './models';
import { dimensionsFromContext } from './utils';
import { InvalidateInput } from '../../loaders/models';

export const CACHE_KEY_PREFIX = 'scLoader';

/**
 * Compose the canonical cache key.
 * Format: loader:<namespace?>:<site>:<language>:<variantId>:<loaderId>:<route>:<paramsHash>
 */
export function buildCacheKey(
  loaderId: string,
  ctx: LoaderContext
): { key: string; dimensions: CacheKeyDimensions } {
  const dimensions = dimensionsFromContext(loaderId, ctx);
  const key = serializeKey(dimensions);
  return { key, dimensions };
}

export function serializeKey(dimensions: CacheKeyDimensions): string {
  return [
    CACHE_KEY_PREFIX,
    encodeURIComponent(dimensions.site),
    encodeURIComponent(dimensions.locale),
    encodeURIComponent(dimensions.variantId),
    encodeURIComponent(dimensions.loaderId),
    encodeURIComponent(dimensions.route),
  ].join(':');
}

/**
 * Tag list mirrored alongside each entry — used by invalidate() to find matching keys.
 */
export function buildDefaultTags(dimensions: CacheKeyDimensions): string[] {
  return [
    `site:${encodeURIComponent(dimensions.site)}`,
    `locale:${encodeURIComponent(dimensions.locale)}`,
    `variant:${encodeURIComponent(dimensions.variantId)}`,
    `loader:${encodeURIComponent(dimensions.loaderId)}`,
    `route:${encodeURIComponent(dimensions.route)}`,
  ];
}

/**
 * Resolve an InvalidateInput into the set of tags that an entry must carry to match.
 * Omitted dimensions widen to "all" (no tag constraint on that axis);
 * `site` defaults to `defaultSiteName` unless explicitly '*'.
 *
 * At least one of `filter.route` or `filter.tags` should be set; otherwise the
 * returned list contains only the site constraint (which would match every
 * entry on the default site). Callers (admin middleware, CLI) enforce that
 * precondition.
 */
export function resolveTagsToInvalidate(
  filter: InvalidateInput,
  defaultSiteName: string
): string[] {
  const tags: string[] = [];

  const site = filter.site === '*' ? null : filter.site ?? defaultSiteName;
  if (site) tags.push(`site:${encodeURIComponent(site)}`);
  if (filter.language) tags.push(`locale:${encodeURIComponent(filter.language)}`);
  if (filter.variantId) tags.push(`variant:${encodeURIComponent(filter.variantId)}`);
  if (filter.loaderId) tags.push(`loader:${encodeURIComponent(filter.loaderId)}`);
  if (filter.route) tags.push(`route:${encodeURIComponent(filter.route)}`);
  // Custom tags are matched verbatim (no prefix transformation).
  if (filter.tags?.length) tags.push(...filter.tags);
  return tags;
}
