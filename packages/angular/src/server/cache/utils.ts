import {
  LoaderCacheConfig,
  LoaderCacheReadResult,
  LoaderCacheEntry,
  LoaderContext,
} from '../../loaders/models';
import { GlobalLoaderCacheConfig, CacheKeyDimensions, DEFAULT_CACHE_TTL } from './models';

/**
 * @deprecated only used for demo purposes. remove before release.
 */
export function approxByteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}

function stripQuery(url: string): string {
  const i = url.indexOf('?');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Converts a loader URL to the pathKey segment used in OSR-aligned cache keys.
 * Strips an optional leading locale segment when it matches `params.locale`.
 * @internal
 */
export function urlToPathKey(url: string, locale?: string): string {
  const pathname = stripQuery(url || '/').replace(/^\/+|\/+$/g, '');
  let segments = pathname ? pathname.split('/').filter(Boolean) : [];
  if (locale && segments[0]?.toLowerCase() === locale.toLowerCase()) {
    segments = segments.slice(1);
  }
  if (segments.length === 0) {
    return '_';
  }
  return segments.map((segment) => sanitizeSitecoreCacheSegment(segment)).join('/');
}

/**
 * Builder hook for tests and the admin endpoint.
 * @internal
 */
export function dimensionsFromContext(loaderId: string, ctx: LoaderContext): CacheKeyDimensions {
  const params = (ctx.params ?? {}) as Record<string, unknown>;
  const site = (params?.['site'] as string) || 'default';
  const locale = (params?.['locale'] as string) || 'en';
  const pathKey = urlToPathKey(ctx.url || '/', locale);

  return {
    site,
    locale,
    variantId: 'default',
    loaderId,
    pathKey,
  };
}

/**
 * Strips `driver` from {@link GlobalLoaderCacheConfig}.
 * @internal
 */
export function resolveConfig(config: GlobalLoaderCacheConfig): LoaderCacheConfig {
  const { driver: _, ...rest } = config;
  return rest;
}

/**
 * Applies defaults for every {@link LoaderCacheConfig} field.
 * @internal
 */
export function applyLoaderCacheConfigDefaults(
  config: LoaderCacheConfig = {}
): Required<LoaderCacheConfig> {
  return {
    revalidate: config.revalidate ?? DEFAULT_CACHE_TTL,
    enabled: config.enabled ?? true,
    defaultSiteName: config.defaultSiteName ?? 'default',
    tags: config.tags ?? [],
    sites: config.sites ?? [],
    defaultLocale: config.defaultLocale ?? 'en',
  };
}

/**
 * Maps a stored entry to the three-outcome read result used by the resolver (Phase 3 SWR).
 * @internal
 */
export function evaluateCacheRead(
  cacheKey: string,
  entry: LoaderCacheEntry | null | undefined,
  now = Date.now()
): LoaderCacheReadResult {
  if (!entry) {
    return { kind: 'miss', cacheKey };
  }
  if (entry.stale || (entry.expiresAt !== null && entry.expiresAt <= now)) {
    return { kind: 'stale', value: entry.value, cacheKey };
  }
  return { kind: 'hit', value: entry.value, cacheKey };
}

/**
 * Sanitizes a segment for Sitecore cache keys and tags.
 * @internal
 */
export function sanitizeSitecoreCacheSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[/:\s]+/g, '_');
}

/**
 * Normalizes a Sitecore item GUID for cache keys/tags (lowercase, no braces).
 * @internal
 */
export function normalizeSitecoreItemIdForCacheKey(itemId: string): string {
  return itemId.trim().toLowerCase().replace(/[{}]/g, '');
}

/**
 * Deduplicates strings while preserving first-seen order.
 * @internal
 */
export function dedupeCacheStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out;
}
