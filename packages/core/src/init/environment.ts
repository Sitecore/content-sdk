import { EnvironmentHandlers, CookieOptions } from './models';

/**
 * Creates environment handlers for browser environments.
 * Use this when running in a standard browser context where `document` is available.
 *
 * @example
 * ```typescript
 * import { initSitecore, createBrowserEnvironment } from '@sitecore-content-sdk/core';
 *
 * await initSitecore({
 *   config,
 *   plugins: [myPlugin()],
 *   environment: createBrowserEnvironment()
 * });
 * ```
 *
 * @returns EnvironmentHandlers configured for browser
 * @public
 */
export function createBrowserEnvironment(): EnvironmentHandlers {
  return {
    getCookie: (name: string): string | undefined => {
      if (typeof document === 'undefined') return undefined;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : undefined;
    },
    setCookie: (name: string, value: string, options?: CookieOptions): void => {
      if (typeof document === 'undefined') return;
      let cookie = `${name}=${encodeURIComponent(value)}`;

      if (options?.maxAge !== undefined) {
        cookie += `; max-age=${options.maxAge}`;
      }
      if (options?.path) {
        cookie += `; path=${options.path}`;
      } else {
        cookie += '; path=/';
      }
      if (options?.domain) {
        cookie += `; domain=${options.domain}`;
      }
      if (options?.secure) {
        cookie += '; secure';
      }
      if (options?.sameSite) {
        cookie += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookie;
    },
    deleteCookie: (name: string): void => {
      if (typeof document === 'undefined') return;
      document.cookie = `${name}=; max-age=0; path=/`;
    },
    getPathname: (): string => {
      if (typeof window === 'undefined') return '';
      return window.location.pathname;
    },
  };
}

/**
 * Creates a no-op environment for server-side contexts where
 * browser APIs are not available and no request/response objects are provided.
 * All handlers return undefined or do nothing.
 *
 * @example
 * ```typescript
 * import { initSitecore, createServerEnvironment } from '@sitecore-content-sdk/core';
 *
 * // Use when you don't need cookie/header access
 * await initSitecore({
 *   config,
 *   plugins: [myPlugin()],
 *   environment: createServerEnvironment()
 * });
 * ```
 *
 * @returns EnvironmentHandlers with no-op implementations
 * @public
 */
export function createServerEnvironment(): EnvironmentHandlers {
  return {
    getCookie: () => undefined,
    setCookie: () => {},
    deleteCookie: () => {},
    getHeader: () => undefined,
    getPathname: () => '',
  };
}

/**
 * Options for creating Next.js App Router environment handlers.
 * @public
 */
export interface NextJsAppRouterEnvironmentOptions {
  /**
   * The cookies() function from next/headers.
   * Import and pass it: `import { cookies } from 'next/headers'`
   */
  cookies: () => {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options?: CookieOptions) => void;
    delete: (name: string) => void;
  };
  /**
   * The headers() function from next/headers.
   * Import and pass it: `import { headers } from 'next/headers'`
   */
  headers?: () => {
    get: (name: string) => string | null;
  };
}

/**
 * Creates environment handlers for Next.js App Router (Server Components, Route Handlers).
 * Requires passing the `cookies` and optionally `headers` functions from `next/headers`.
 *
 * @example
 * ```typescript
 * import { cookies, headers } from 'next/headers';
 * import { initSitecore, createNextJsAppRouterEnvironment } from '@sitecore-content-sdk/core';
 *
 * await initSitecore({
 *   config,
 *   plugins: [myPlugin()],
 *   environment: createNextJsAppRouterEnvironment({ cookies, headers })
 * });
 * ```
 *
 * @param options - Next.js App Router specific options
 * @returns EnvironmentHandlers configured for Next.js App Router
 * @public
 */
export function createNextJsAppRouterEnvironment(
  options: NextJsAppRouterEnvironmentOptions
): EnvironmentHandlers {
  const { cookies, headers } = options;

  return {
    getCookie: (name: string): string | undefined => {
      try {
        return cookies().get(name)?.value;
      } catch {
        return undefined;
      }
    },
    setCookie: (name: string, value: string, cookieOptions?: CookieOptions): void => {
      try {
        cookies().set(name, value, cookieOptions);
      } catch {
        // setCookie may fail in certain contexts (e.g., after response started)
      }
    },
    deleteCookie: (name: string): void => {
      try {
        cookies().delete(name);
      } catch {
        // deleteCookie may fail in certain contexts
      }
    },
    getHeader: headers
      ? (name: string): string | undefined => {
          try {
            return headers().get(name) ?? undefined;
          } catch {
            return undefined;
          }
        }
      : () => undefined,
  };
}

/**
 * Options for creating Next.js Middleware environment handlers.
 * @public
 */
export interface NextJsMiddlewareEnvironmentOptions {
  /**
   * The incoming Next.js request object
   */
  request: {
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };
    headers: {
      get: (name: string) => string | null;
    };
    nextUrl: {
      pathname: string;
    };
  };
  /**
   * The Next.js response object (for setting cookies)
   */
  response?: {
    cookies: {
      set: (name: string, value: string, options?: CookieOptions) => void;
      delete: (name: string) => void;
    };
  };
}

/**
 * Creates environment handlers for Next.js Middleware.
 * Pass the request and optionally response objects from your middleware function.
 *
 * @example
 * ```typescript
 * import { NextResponse } from 'next/server';
 * import type { NextRequest } from 'next/server';
 * import { initSitecore, createNextJsMiddlewareEnvironment } from '@sitecore-content-sdk/core';
 *
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   await initSitecore({
 *     config,
 *     plugins: [myPlugin()],
 *     environment: createNextJsMiddlewareEnvironment({ request, response })
 *   });
 *
 *   return response;
 * }
 * ```
 *
 * @param options - Next.js Middleware specific options
 * @returns EnvironmentHandlers configured for Next.js Middleware
 * @public
 */
export function createNextJsMiddlewareEnvironment(
  options: NextJsMiddlewareEnvironmentOptions
): EnvironmentHandlers {
  const { request, response } = options;

  return {
    getCookie: (name: string): string | undefined => {
      return request.cookies.get(name)?.value;
    },
    setCookie: response
      ? (name: string, value: string, cookieOptions?: CookieOptions): void => {
          response.cookies.set(name, value, cookieOptions);
        }
      : () => {},
    deleteCookie: response
      ? (name: string): void => {
          response.cookies.delete(name);
        }
      : () => {},
    getHeader: (name: string): string | undefined => {
      return request.headers.get(name) ?? undefined;
    },
    getPathname: (): string => {
      return request.nextUrl.pathname;
    },
  };
}

/**
 * Merges multiple environment handlers into one.
 * Later handlers override earlier ones for the same key.
 * Useful for combining base handlers with custom extensions.
 *
 * @example
 * ```typescript
 * const env = mergeEnvironments(
 *   createBrowserEnvironment(),
 *   { customHandler: () => 'custom value' }
 * );
 * ```
 *
 * @param environments - Environment handlers to merge
 * @returns Merged environment handlers
 * @public
 */
export function mergeEnvironments(...environments: EnvironmentHandlers[]): EnvironmentHandlers {
  return Object.assign({}, ...environments);
}

