import {
  initSitecore as initSitecoreCore,
  InitOptions,
  Plugin,
  EnvironmentHandlers,
  CookieOptions,
} from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '../config';

/**
 * Options for initializing the SDK in the browser context.
 * @public
 */
export interface ClientInitOptions {
  /**
   * The Sitecore configuration object
   */
  config: SitecoreConfig;
  /**
   * Array of plugins to enable
   */
  plugins?: Plugin[];
  /**
   * Additional environment handlers to merge with the browser defaults
   */
  environment?: EnvironmentHandlers;
}

/**
 * Creates environment handlers for browser context.
 * Provides access to document.cookie and window.location.
 *
 * @returns Environment handlers configured for browser
 * @internal
 */
function createBrowserEnvironment(): EnvironmentHandlers {
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
    getSearchParams: (): URLSearchParams => {
      if (typeof window === 'undefined') return new URLSearchParams();
      return new URLSearchParams(window.location.search);
    },
    getHost: (): string => {
      if (typeof window === 'undefined') return '';
      return window.location.host;
    },
  };
}

/**
 * Initializes the Sitecore SDK for use in the browser (client-side).
 * Should be called in a useEffect or after the component has mounted.
 *
 * @example
 * ```typescript
 * // components/SitecoreInit.tsx (Client Component)
 * 'use client';
 *
 * import { useEffect } from 'react';
 * import { initClient } from '@sitecore-content-sdk/nextjs/init';
 * import config from './sitecore.config';
 *
 * export function SitecoreInit() {
 *   useEffect(() => {
 *     initClient({
 *       config,
 *       plugins: [eventsPlugin()]
 *     });
 *   }, []);
 *
 *   return null;
 * }
 * ```
 *
 * @param options - Client initialization options
 * @returns Promise that resolves when initialization is complete
 * @public
 */
export async function initClient(options: ClientInitOptions): Promise<void> {
  const { config, plugins = [], environment = {} } = options;

  // Warn if not in browser
  if (typeof window === 'undefined') {
    console.warn(
      '[initClient] Called in a server context. Use initServer or initMiddleware instead.'
    );
  }

  // Create browser-specific environment handlers
  const browserEnvironment = createBrowserEnvironment();

  // Merge with any custom handlers (custom handlers take precedence)
  const mergedEnvironment: EnvironmentHandlers = {
    ...browserEnvironment,
    ...environment,
  };

  const initOptions: InitOptions = {
    config,
    plugins,
    environment: mergedEnvironment,
  };

  await initSitecoreCore(initOptions);
}

