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
 * @public
 */
export interface LoaderCacheConfig {
  /** default TTL in seconds; pass 'infinite' to never expire */
  revalidate?: number;
  /** master switch — set to false to make every call fall through to the raw loader */
  enabled?: boolean;
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
}

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
 * Global config for the loader cache.
 * @public
 */
export interface GlobalLoaderCacheConfig extends LoaderCacheConfig {
  /**
   * unstorage driver for the cache. Default in-memory cache is used when empty.
   */
  driver?: 'memory' | 'redis' | 'fs';
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
  getConfig(): Readonly<LoaderCacheConfig>;
}
