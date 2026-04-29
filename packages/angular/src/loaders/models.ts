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
   * Route parameters from all matched segments
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
  | { kind: 'redirect'; data: LoaderRedirectResult }
  | { kind: 'error'; status: number; message: string }
  | { kind: 'notFound'; status: number };

/**
 * Normalize loader HTTP payloads (legacy `{ kind: 'redirect', redirect: … }` → `data`).
 * @public
 */
export function normalizeLoaderApiResponse(resp: LoaderApiResponse): LoaderApiResponse {
  if (resp.kind !== 'redirect') {
    return resp;
  }
  const r = resp as LoaderApiResponse & {
    data?: LoaderRedirectResult;
    redirect?: LoaderRedirectResult;
  };
  if (r.data !== undefined) {
    return { kind: 'redirect', data: r.data };
  }
  if (r.redirect !== undefined) {
    return { kind: 'redirect', data: r.redirect };
  }
  return resp;
}

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
