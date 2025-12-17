import { NextRequest, NextResponse } from 'next/server';
import {
  initSitecore as initSitecoreCore,
  InitOptions,
  Plugin,
  EnvironmentHandlers,
  CookieOptions,
} from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '../config';

/**
 * Options for initializing the SDK in Next.js middleware context.
 * @public
 */
export interface MiddlewareInitOptions {
  /**
   * The Sitecore configuration object
   */
  config: SitecoreConfig;
  /**
   * The incoming Next.js request object from middleware
   */
  request: NextRequest;
  /**
   * The Next.js response object from middleware
   */
  response: NextResponse;
  /**
   * Array of plugins to enable
   */
  plugins?: Plugin[];
  /**
   * Additional environment handlers to merge with the middleware defaults
   */
  environment?: EnvironmentHandlers;
}

/**
 * Creates environment handlers specifically for Next.js middleware context.
 * Provides cookie, header, and pathname access through the middleware request/response.
 *
 * @param request - The Next.js middleware request
 * @param response - The Next.js middleware response
 * @returns Environment handlers configured for middleware
 * @internal
 */
export function createMiddlewareEnvironment(
  request: NextRequest,
  response: NextResponse
): EnvironmentHandlers {
  return {
    getCookie: (name: string): string | undefined => {
      return request.cookies.get(name)?.value;
    },
    setCookie: (name: string, value: string, options?: CookieOptions): void => {
      response.cookies.set(name, value, options);
    },
    deleteCookie: (name: string): void => {
      response.cookies.delete(name);
    },
    getHeader: (name: string): string | undefined => {
      return request.headers.get(name) ?? undefined;
    },
    setHeader: (name: string, value: string): void => {
      response.headers.set(name, value);
    },
    getPathname: (): string => {
      return request.nextUrl.pathname;
    },
    getSearchParams: (): URLSearchParams => {
      return request.nextUrl.searchParams;
    },
    getHost: (): string => {
      return request.headers.get('host')?.split(':')[0] ?? 'localhost';
    },
  };
}

/**
 * Initializes the Sitecore SDK for use in Next.js middleware.
 * Automatically configures environment handlers for the middleware context,
 * providing access to cookies, headers, and request information.
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { NextResponse } from 'next/server';
 * import type { NextRequest } from 'next/server';
 * import { initMiddleware } from '@sitecore-content-sdk/nextjs/init';
 * import config from './sitecore.config';
 *
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   await initMiddleware({
 *     config,
 *     request,
 *     response,
 *     plugins: [eventsPlugin(), personalizePlugin()]
 *   });
 *
 *   // Your middleware logic here...
 *
 *   return response;
 * }
 * ```
 *
 * @param options - Middleware initialization options
 * @returns Promise that resolves when initialization is complete
 * @public
 */
export async function initMiddleware(options: MiddlewareInitOptions): Promise<void> {
  const { config, request, response, plugins = [], environment = {} } = options;

  // Create middleware-specific environment handlers
  const middlewareEnvironment = createMiddlewareEnvironment(request, response);

  // Merge with any custom handlers (custom handlers take precedence)
  const mergedEnvironment: EnvironmentHandlers = {
    ...middlewareEnvironment,
    ...environment,
  };

  // Transform SitecoreConfig to InitConfig for core initialization
  const initConfig = {
    sitecoreContextId: config.api.edge.contextId,
    sitecoreEdgeUrl: config.api.edge.edgeUrl,
  };

  const initOptions: InitOptions = {
    config: initConfig,
    plugins,
    environment: mergedEnvironment,
  };

  await initSitecoreCore(initOptions);
}

