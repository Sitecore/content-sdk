import type { Params } from '@angular/router';

/**
 * Request context containing information from the incoming HTTP request.
 * Used for site resolution and other request-dependent operations in loaders.
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

export type LoaderApiResponse =
  | { kind: 'data'; data: any }
  | { kind: 'redirect'; location: string; status: number }
  | { kind: 'error'; status: number; message: string }
  | { kind: 'notFound'; status: number };

/**
 * Loader function type.
 * A loader is an async function that receives context and returns data.
 * @public
 */
export type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T;

export class LoaderRedirect extends Error {
  constructor(public location: string, public status: 301 | 302 | 307 | 308 = 302) {
    super(`Redirect to ${location}`);
  }
}

export class NotFoundNavigationError extends Error {
  constructor(message = 'Not Found') {
    super(message);
  }
}

export class LoaderHttpError extends Error {
  constructor(public status: number, message = 'Error') {
    super(message);
  }
}
