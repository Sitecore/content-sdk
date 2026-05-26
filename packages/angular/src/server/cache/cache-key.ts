import type { LoaderContext } from '../../loaders/models';
import { CacheKeyDimensions, dimensionsFromContext, InvalidateInput } from './models';

const KEY_PREFIX = 'loader';

/**
 * Compose the canonical cache key.
 * Format: loader:<namespace?>:<site>:<language>:<variantId>:<loaderId>:<route>:<paramsHash>
 */
export function buildCacheKey(
  loaderId: string,
  ctx: LoaderContext,
  namespace?: string
): { key: string; dimensions: CacheKeyDimensions } {
  const dims = dimensionsFromContext(loaderId, ctx);
  const key = serializeKey(dims, namespace);
  return { key, dimensions: dims };
}

export function serializeKey(d: CacheKeyDimensions, namespace?: string): string {
  const ns = namespace ? `:${escapeSegment(namespace)}` : '';
  return [
    KEY_PREFIX + ns,
    escapeSegment(d.site),
    escapeSegment(d.language),
    escapeSegment(d.variantId),
    escapeSegment(d.loaderId),
    escapeSegment(d.route),
    d.paramsHash,
  ].join(':');
}

/**
 * Tag list mirrored alongside each entry — used by invalidate() to find matching keys.
 */
export function buildTags(d: CacheKeyDimensions, namespace?: string): string[] {
  const ns = namespace ? `${escapeSegment(namespace)}:` : '';
  return [
    `${ns}site:${escapeSegment(d.site)}`,
    `${ns}language:${escapeSegment(d.language)}`,
    `${ns}variant:${escapeSegment(d.variantId)}`,
    `${ns}loader:${escapeSegment(d.loaderId)}`,
    `${ns}route:${escapeSegment(d.route)}`,
  ];
}

/**
 * Resolve an InvalidateFilter into the set of tags that an entry must carry to match.
 * Omitted dimensions widen to "all" (no tag constraint on that axis);
 * `site` defaults to `defaultSiteName` unless explicitly '*'.
 */
export function filterToRequiredTags(filter: InvalidateInput, namespace?: string): string[] {
  const ns = namespace ? `${escapeSegment(namespace)}:` : '';
  const required: string[] = [];

  const site = filter.site === '*' ? null : filter.site ?? defaultSiteName;
  if (site) required.push(`${ns}site:${escapeSegment(site)}`);
  if (filter.language) required.push(`${ns}language:${escapeSegment(filter.language)}`);
  if (filter.variantId) required.push(`${ns}variant:${escapeSegment(filter.variantId)}`);
  if (filter.loaderId) required.push(`${ns}loader:${escapeSegment(filter.loaderId)}`);

  required.push(`${ns}route:${escapeSegment(filter.route)}`);
  return required;
}

/**
 * Segments are delimited by ':' in the key; any ':' in a segment value would
 * collide. URL-encode the colon (and a few other unsafe chars) to keep parsing
 * trivial.
 */
function escapeSegment(s: string): string {
  return s.replace(/[:%]/g, (c) => encodeURIComponent(c));
}
