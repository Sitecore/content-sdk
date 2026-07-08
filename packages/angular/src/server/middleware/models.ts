import { InjectionToken } from '@angular/core';
import type { CsdkRequestParams, CsdkRequestData } from '../../loaders/models';
import type { PathPattern } from '../utils';
import type { ExpressRequest, ExpressResponse, CookieOptions } from '../../config/http-types';
export { ExpressRequest, ExpressResponse, CookieOptions };
/**
 * Injection token for the request context extractor (used by tests to provide a mock via TestBed).
 * @internal
 */
export const EXTRACT_REQUEST_CONTEXT_TOKEN = new InjectionToken<
  (req: ExpressRequest) => CsdkRequestData
>('EXTRACT_REQUEST_CONTEXT');

/**
 * Express next function type
 * @public
 */
export type ExpressNextFunction = (error?: unknown) => void;
export interface CsdkExpressRequest extends ExpressRequest {
  scParams?: CsdkRequestParams;
}
/**
 * Express-compatible middleware type
 * @public
 */
export type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => void | Promise<void>;

/**
 * Matcher configuration for middleware path inclusion/exclusion. Each pattern is either a `string`
 * (matched exactly) or a `RegExp` (matched with `.test`).
 * @public
 */
export interface MiddlewareMatcher {
  /**
   * Paths to **include**. If provided, only matching paths are processed.
   * Example: `['/about', /^\/products\//]`
   */
  includePaths?: PathPattern[];
  /**
   * Paths to **exclude** (always skipped), evaluated before {@link MiddlewareMatcher.includePaths}.
   * Example: `['/health', /\.json$/]`
   */
  excludePaths?: PathPattern[];
}

/**
 * Base configuration for server middlewares (multisite, personalization, redirects, etc).
 * Provides common path matching and skip logic.
 * @public
 */
export interface BaseMiddlewareOptions {
  /**
   * Enable/disable this middleware. When false, all requests skip it.
   * @default true
   */
  enabled?: boolean;
  /**
   * Custom request predicate to skip middleware execution. Runs after built-in checks.
   */
  skip?: (req: ExpressRequest) => boolean;
  /**
   * Path matching rules (glob patterns) to control which requests this middleware processes.
   * Integrates with default exclusions (API routes, static files, editing/preview).
   */
  matcher?: MiddlewareMatcher;
}
