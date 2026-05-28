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
 * Base browser-safe config type for loader cache.
 *
 * `revalidate` is in seconds. A positive value caches the entry for that many
 * seconds; `0` or a negative value means "never expire" (rely on explicit
 * invalidation). There is no `'infinite'` sentinel.
 * @public
 */
export interface LoaderCacheConfig extends PerRouteLoaderCacheConfig {
  /** Default site name for tag helpers and admin tooling. Defaults to `'default'`. */
  defaultSiteName?: string;
  /**
   * Site names used by revalidation middleware to fan out dictionary loader tags
   * (`sc:loader:dictionary:<site>:<locale>`) on every webhook call.
   */
  sites?: string[];
  /** Fallback locale for tag helpers when a site entry has no `language`. Defaults to `'en'`. */
  defaultLocale?: string;
}

/**
 * Per-route cache configuration.
 * @public
 */
export interface PerRouteLoaderCacheConfig {
  /** TTL in seconds. Positive → expires after N seconds; `0` or negative → never expires. */
  revalidate?: number;
  /** Master switch — when false, every call falls through to the raw loader. */
  enabled?: boolean;
  /**
   * Custom tags applied to every entry this loader writes. Merged with built-in
   * OSR tags (self-key, `sc:site`, `sc:locale`, and `sc:item` for page loaders).
   */
  tags?: string[];
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
 *
 * - `hit` — entry is fresh; serve cached value without running the loader.
 * - `stale` — entry expired or was invalidated; serve cached value and refresh in the background.
 * - `miss` — no entry; run the loader synchronously.
 * @public
 */
export type LoaderCacheReadResult =
  /** Fresh cache entry within TTL and not marked stale. */
  | { kind: 'hit'; value: unknown; cacheKey: string }
  /** Expired or invalidated entry; value is served while a background refresh runs. */
  | { kind: 'stale'; value: unknown; cacheKey: string }
  /** No entry stored for the requested cache key. */
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
 * Tag-based invalidation input.
 * Marks matching entries stale via the tag index; does not delete them (SWR semantics).
 * @public
 */
export interface InvalidateInput {
  /** Non-empty list of OSR tags (for example `sc:item:…`, `sc:site:…`, or a cache key self-tag). */
  tags?: string[];
}

/**
 * Server-only cache instance. Constructed once in `server.ts` via
 * {@link createLoaderCache} and passed by reference to middleware factories
 * ({@link createLoaderDataServiceMiddleware}, {@link createCacheAdminMiddleware},
 * {@link createSitecoreRevalidateMiddleware}) and to Angular SSR through
 * `angularApp.handle(req, { cache })`.
 *
 * Implementations maintain a sidecar tag index so {@link LoaderCache.invalidate}
 * can mark entries stale without scanning every key.
 * @public
 */
export interface LoaderCache {
  /**
   * Reads a cache entry and classifies it as hit, stale, or miss.
   * @param key - OSR-aligned cache key (for example `sc:loader:page:demo:en:default:about`).
   */
  get(key: string): Promise<LoaderCacheReadResult>;
  /**
   * Stores an entry and links it to the supplied tag set.
   * @param key - Cache key to write.
   * @param value - Loader payload to persist.
   * @param ttlSeconds - TTL in seconds; `0` or negative means never expire.
   * @param tags - Tag index pointers written alongside the entry (self-key, site, locale, item, etc.).
   */
  set(key: string, value: unknown, ttlSeconds: number, tags: string[]): Promise<void>;
  /**
   * Marks every entry linked to any of the supplied tags as stale.
   * @param filter - Tag list to resolve through the tag index.
   * @returns Number of entries marked stale (includes entries already stale).
   */
  invalidate(filter: InvalidateInput): Promise<number>;
  /** Removes a single entry and unlinks it from the tag index. */
  delete(key: string): Promise<boolean>;
  /** Removes every entry and clears the tag index. */
  flush(): Promise<void>;
  /** Returns lightweight metadata for admin tooling (values are omitted). */
  entries(): Promise<LoaderCacheEntryInfo[]>;
  /** Global default TTL in seconds from {@link LoaderCacheConfig.revalidate}. */
  resolveTtl(): number;
  /** Whether caching is enabled globally. Per-route overrides may still opt in. */
  enabled(): boolean;
  /** Resolved configuration (useful for admin UI and diagnostics). */
  getConfig(): Readonly<LoaderCacheConfig>;
}
