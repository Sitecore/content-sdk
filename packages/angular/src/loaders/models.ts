import type { Params } from '@angular/router';
export const DEFAULT_NOT_FOUND_ROUTE = '/404';
export const DEFAULT_ERROR_ROUTE = '/500';

/**
 * Request context containing information from the incoming HTTP request.
 * Used for request-dependent operations in loaders.
 * @public
 */
export interface RequestContext {
  /**
   * The hostname from the request (without port)
   */
  hostname?: string;
  /**
   * Cookies from the request
   */
  cookies?: Record<string, string>;
  /**
   * Query parameters from the request
   */
  query?: Record<string, string | string[] | undefined>;
  /**
   * Headers from the request
   */
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Context provided to loader functions.
 * Contains information about the current request including URL, params, query, and request context.
 * @public
 */
export type LoaderContext = {
  /**
   * The current URL path
   */
  url: string;
  /**
   * Route parameters from all matched segments.
   *
   * When locales are configured and the route tree uses `scLocaleMatcher`, the matched
   * locale is exposed as `params.locale`. The resolver also defaults `params.locale` to
   * `defaultLanguage` from `sitecore.config` when no locale segment was matched — loaders
   * can rely on a concrete `params.locale` regardless of URL shape.
   */
  params: Params;
  /**
   * Query string parameters
   */
  query: Record<string, string | string[]>;
  /**
   * Server-only: the incoming request
   */
  req?: Request;
  /**
   * Server-only: the response object
   */
  res?: Response;
  /**
   * Server-only: context from the incoming HTTP request.
   * Contains hostname, cookies, query params, and headers.
   * Use with createSiteResolver() to determine the current site.
   * @example
   * ```typescript
   * const resolveSite = createSiteResolver({ sites, defaultSite: config.defaultSite });
   *
   * export const pageLoader: LoaderFn = async (ctx) => {
   *   if (ctx.requestContext) {
   *     const { site } = resolveSite(ctx.requestContext);
   *     return client.getPage(ctx.url, { site: site.name });
   *   }
   *   return client.getPage(ctx.url);
   * };
   * ```
   */
  requestContext?: RequestContext;
};

export type LoaderApiRequest = {
  loaderId: string;
  url: string;
  params: Params;
  query: Record<string, any>;
  /**
   * Server-derived request context (hostname, headers, cookies, query).
   * Populated once at the request boundary (`/_data` middleware closure or the
   * SSR resolver). Downstream code reads this directly; nobody re-extracts.
   * Phase 2 of the refactor plan.
   */
  angularRequestContext?: RequestContext;
  /**
   * Per-route cache overrides supplied at the `loaderResolver(id, cacheOptions)`
   * call site. The browser includes them in the `/_data` POST body so the same
   * per-route policy applies on CSR navigations. Phase 5 of the refactor plan.
   */
  cacheOptions?: LoaderCacheConfig;
};

export type LoaderRedirectResult = {
  loaderRedirectTarget: string;
  status?: number;
};

/**
 * Type guard for redirect results returned by loaders.
 * @param {unknown} v - Value to check
 * @internal
 */
export function isLoaderRedirectResult(v: unknown): v is LoaderRedirectResult {
  return (
    typeof v === 'object' &&
    v !== null &&
    'loaderRedirectTarget' in v &&
    typeof (v as LoaderRedirectResult).loaderRedirectTarget === 'string'
  );
}

export type LoaderApiResponse =
  | { kind: 'data'; data: any }
  | { kind: 'redirect'; redirect: LoaderRedirectResult }
  | { kind: 'error'; status: number; message: string }
  | { kind: 'notFound'; status: number };

/**
 * Result returned by loader resolution on the server (SSR and `/_data` endpoint).
 * Uses the shared cross-boundary loader registry; not a separate server loader set.
 * @public
 */
export type LoaderDataResult =
  | { kind: 'data'; data: unknown }
  | { kind: 'redirect'; redirect: LoaderRedirectResult }
  | { kind: 'error'; status: number; message: string; cause?: unknown };

/**
 * Loader function type.
 * A loader is an async function that receives context, can be applied in route resolvers and can return:
 * - data - any data that can be serialized and stored in the transfer state
 * - redirect - a redirect to be applied to the router
 * - throw error - an error that occurred during the retrieval of the data
 * @public
 */
export type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T | LoaderRedirectResult;

export class NotFoundNavigationError extends Error {
  constructor(message = 'Not Found') {
    super(message);
  }
}

export class LoaderHttpError extends Error {
  constructor(public status: number, message = 'Content SDK Loader Error') {
    super(message);
  }
}

/**
 * Base config for loader cache. Can be applied per loader.
 *
 * `revalidate` is in seconds. A positive value caches the entry for that many
 * seconds; `0` or a negative value means "never expire" (rely on explicit
 * invalidation). There is no `'infinite'` sentinel.
 * @public
 */
export interface LoaderCacheConfig {
  /** TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires. */
  revalidate?: number;
  /** Master switch — when false, every call falls through to the raw loader. */
  enabled?: boolean;
  /** Default site name for tag helpers and admin tooling. Defaults to `'default'`. */
  defaultSiteName?: string;
  /**
   * Custom tags applied to every entry this loader writes. Merged with built-in
   * OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).
   */
  tags?: string[];
  sites?: string[];
  defaultLocale?: string;
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
  stale: boolean;
}

/**
 * Three-outcome read result for stale-while-revalidate (Phase 3).
 * @public
 */
export type LoaderCacheReadResult =
  | { kind: 'hit'; value: unknown; cacheKey: string }
  | { kind: 'stale'; value: unknown; cacheKey: string }
  | { kind: 'miss'; cacheKey: string };

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
  /** When true (or TTL expired), entry is served stale while refreshing. */
  stale: boolean;
}

/**
 * Tag-based invalidation input
 * Marks matching entries stale; does not delete them.
 * @public
 */
export interface InvalidateInput {
  tags?: string[];
}

/**
 * Server-only cache instance. Constructed once in server.ts via
 * createLoaderCache() and passed by reference to the middleware factories
 * (`createLoaderDataServiceMiddleware`, `createCacheAdminMiddleware`) and to
 * Angular SSR through `angularApp.handle(req, { cache })`.
 * @public
 */
export interface LoaderCache {
  get(key: string): Promise<LoaderCacheReadResult>;
  /**
   * Stores an entry. `ttlSeconds > 0` makes the entry expire after that many
   * seconds; `0` or negative means "never expire". Always writes `stale: false`.
   */
  set(key: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void>;
  /** Marks entries stale by tag. Returns number of entries marked. */
  invalidate(filter: InvalidateInput): Promise<number>;
  /** Direct delete by exact key. */
  delete(key: string): Promise<boolean>;
  /** Nuke every entry. */
  flush(): Promise<void>;
  /** Returns lightweight metadata for every live entry — used by admin tooling. */
  entries(): Promise<LoaderCacheEntryInfo[]>;
  resolveTtl(): number;
  enabled(): boolean;
  /** Reads back the resolved config (useful for admin UI). */
  getConfig(): Readonly<LoaderCacheConfig>;
}
