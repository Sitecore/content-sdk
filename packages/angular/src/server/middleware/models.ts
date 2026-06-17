import { InjectionToken } from '@angular/core';
import type { CsdkRequestParams, CsdkRequestData } from '../../loaders/models';
import type { PathPattern } from '../utils';
/**
 * Injection token for the request context extractor (used by tests to provide a mock via TestBed).
 * @internal
 */
export const EXTRACT_REQUEST_CONTEXT_TOKEN = new InjectionToken<
  (req: ExpressRequest) => CsdkRequestData
>('EXTRACT_REQUEST_CONTEXT');

export interface CookieOptions {
  /** Expiry relative to now, in milliseconds */
  maxAge?: number;
  /** Sign the cookie (needs cookie-parser with a secret) */
  signed?: boolean;
  /** GMT expiry date; omit for session cookie */
  expires?: Date;
  httpOnly?: boolean;
  path?: string; // default "/"
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  priority?: 'low' | 'medium' | 'high';
  partitioned?: boolean;
}

/**
 * Minimal Express Request interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressRequest {
  method: string;
  path: string;
  url: string;
  body: unknown;
  referrer?: string;
  query: Record<string, string | string[] | undefined>;
  /**
   * Cookies from the request (requires cookie-parser middleware)
   */
  cookies?: Record<string, string>;
  /**
   * Headers from the request
   */
  headers?: Record<string, string | string[] | undefined>;
  setHeader?: (name: string, value: string | string[] | undefined) => void;
}

export interface CsdkExpressRequest extends ExpressRequest {
  scParams?: CsdkRequestParams;
}

/**
 * Minimal Express Response interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(data: unknown): void;
  /**
   * Send a raw response body (string, Buffer, null, etc.). Used for HTML
   * responses (editing render endpoint) and 204 no-content replies.
   */
  send?(body: unknown): void;
  /**
   * Set a response header. Used by editing middleware to apply CORS / CSP
   * headers without depending on Express types directly.
   */
  setHeader?(name: string, value: string | string[]): void;
  /**
   * Set a response cookie. Used by multisite middleware to set the site cookie.
   */
  cookie?(name: string, value: string, options?: CookieOptions): void;
}

/**
 * Express next function type
 * @public
 */
export type ExpressNextFunction = (error?: unknown) => void;

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
  skip?: (req: CsdkExpressRequest) => boolean;
  /**
   * Path matching rules (glob patterns) to control which requests this middleware processes.
   * Integrates with default exclusions (API routes, static files, editing/preview).
   */
  matcher?: MiddlewareMatcher;
}
