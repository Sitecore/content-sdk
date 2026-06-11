import { InjectionToken } from '@angular/core';
import type { RequestContext } from '../loaders/models';
import type { LoaderRegistry } from '../loaders/loader-registry.token';
import type { LoaderCache } from '../loaders/models';

/**
 * Injection token for the request context extractor (used by tests to provide a mock via TestBed).
 * @internal
 */
export const EXTRACT_REQUEST_CONTEXT_TOKEN = new InjectionToken<
  (req: ExpressRequest) => RequestContext
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
  sc?: {
    siteName: string;
    variantId?: string;
    componentVariantIds?: string[];
  };
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
 * Configuration for server-side data handlers
 * @public
 */
export interface DataHandlerConfig {
  /**
   * The endpoint path for the data handler.
   * @default '/_data'
   */
  endpoint?: string;
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
 * @public
 */
export type { LoaderRegistry } from '../loaders/loader-registry.token';

/**
 * Options for the Express data handler
 * @public
 */
export interface ExpressDataHandlerOptions extends DataHandlerConfig {
  /**
   * The shared loader registry (same object as provideLoaderRegistry).
   */
  loaders: LoaderRegistry;
  /**
   * Optional loader cache. When supplied, /_data responses go through
   * cache-aside; omit to run loaders directly on every request.
   */
  cache?: LoaderCache;
  /**
   * Optional request context extractor (e.g. for testing via TestBed).
   * If not provided, uses the default implementation from loaders/utils.
   * @internal
   */
  extractRequestContext?: (req: ExpressRequest) => RequestContext;
}
