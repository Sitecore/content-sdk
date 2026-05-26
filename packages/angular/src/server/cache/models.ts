import type { DriverFlags } from 'unstorage';
import type { LoaderContext } from '../../loaders/models';

/**
 * Persisted cache entry shape. Stored under the composite cache key built by
 * buildCacheKey(); see cache-key.ts.
 * @public
 */
export interface LoaderCacheEntry {
  value: unknown;
  tags: string[];
  storedAt: number;
  expiresAt: number | null; // null = never expire
}

/**
 * Per-loader config overrides. Most-specific wins over defaults from
 * LoaderCacheConfig.revalidate / enabled.
 * @public
 */
export interface LoaderCacheLoaderConfig {
  enabled?: boolean;
  ttl?: number;
  /** Reserved for Phase 4 (variant-aware keying). Accepted but ignored in v1. */
  personalize?: boolean;
}

/**
 * Config passed to createLoaderCache().
 * @public
 */
export interface LoaderCacheConfig {
  /** unique app id used to scope keys when multiple apps share a store */
  namespace?: string;
  /** default TTL in seconds; pass 'infinite' to never expire */
  revalidate?: number;
  /** master switch — set to false to make every call fall through to the raw loader */
  enabled?: boolean;
  /** per-loader overrides keyed by loaderId */
  loaders?: Record<string, LoaderCacheLoaderConfig>;
  /** Unstorage `Driver` shorthand. The cache wraps it with `createStorage({ driver })` internally. Use this for single-driver setups (`fs`, `redis`, `memory`, etc). */
  driver?: DriverFlags;
}

/**
 * Filter accepted by cache.invalidate(). `route` is required
 * other fields are optional and will be used to narrow the invalidation.
 * @public
 */
export interface InvalidateInput {
  route: string;
  site?: string | '*';
  language?: string;
  variantId?: string;
  loaderId?: string;
}

/**
 * Metadata returned by cache.entries() — sufficient for an admin UI without
 * shipping the cached values themselves (which can be large).
 * @public
 */
export interface LoaderCacheEntryInfo {
  key: string;
  tags: string[];
  storedAt: number;
  expiresAt: number | null;
  /** Approximate serialized byte length of the cached value. */
  approxBytes: number;
}

/**
 * Server-only cache instance. Constructed once in server.ts via
 * createLoaderCache() and passed by reference to the middleware factories
 * (`createLoaderDataServiceMiddleware`, `createCacheAdminMiddleware`) and to
 * Angular SSR through `angularApp.handle(req, { cache })`.
 * @public
 */
export interface LoaderCache {
  get(key: string): Promise<LoaderCacheEntry | null>;
  set(key: string, value: unknown, ttlSeconds: number | 'infinite', tags: string[]): Promise<void>;
  /** Per-path invalidation. Returns number of entries deleted. */
  invalidate(filter: InvalidateInput): Promise<number>;
  /** Direct delete by exact key. */
  delete(key: string): Promise<boolean>;
  /** Nuke every entry. */
  flush(): Promise<void>;
  /** Returns lightweight metadata for every live entry — used by admin tooling. */
  entries(): Promise<LoaderCacheEntryInfo[]>;
  resolveTtl(loaderId: string): number | 'infinite';
  isEnabled(loaderId: string): boolean;
  /** Reads back the resolved config (useful for admin UI). */
  getConfig(): Readonly<
    Required<Omit<LoaderCacheConfig, 'loaders' | 'storage' | 'driver'>> & {
      loaders: Record<string, LoaderCacheLoaderConfig>;
    }
  >;
}

/**
 * Identity dimensions of a cache key. Derived from LoaderContext by buildCacheKey().
 * @public
 */
export interface CacheKeyDimensions {
  site: string;
  language: string;
  variantId: string;
  loaderId: string;
  route: string;
  paramsHash: string;
}

/**
 * Builder hook for tests and the admin endpoint: turn a LoaderContext into the
 * dimensions used by the key + tag builders.
 * @internal
 */
export function dimensionsFromContext(loaderId: string, ctx: LoaderContext): CacheKeyDimensions {
  const params = (ctx.params ?? {}) as Record<string, unknown>;
  const headers = (ctx.requestContext?.headers ?? {}) as Record<
    string,
    string | string[] | undefined
  >;

  const site =
    (typeof params['site'] === 'string' && (params['site'] as string)) ||
    pickHeader(headers['x-sitecore-site']) ||
    ctx.requestContext?.hostname ||
    'default';

  const language =
    (typeof params['language'] === 'string' && (params['language'] as string)) ||
    (typeof params['locale'] === 'string' && (params['locale'] as string)) ||
    pickHeader(headers['x-sitecore-language']) ||
    'en';

  const route = stripQuery(ctx.url || '/');
  const paramsHash = hashRecord({
    params: ctx.params ?? {},
    query: ctx.query ?? {},
  });

  return {
    site,
    language,
    variantId: 'default',
    loaderId,
    route,
    paramsHash,
  };
}

function pickHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function stripQuery(url: string): string {
  const i = url.indexOf('?');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Stable JSON stringify used to hash params/query so the cache key is
 * order-insensitive. Not cryptographic — a fast non-secure hash is enough.
 */
function hashRecord(obj: unknown): string {
  const canonical = canonicalStringify(obj);
  return fnv1a(canonical).toString(16).padStart(8, '0');
}

function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalStringify).join(',') + ']';
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return (
    '{' +
    keys
      .map(
        (k) => JSON.stringify(k) + ':' + canonicalStringify((value as Record<string, unknown>)[k])
      )
      .join(',') +
    '}'
  );
}

function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}
