import {
  initSitecore as initSitecoreCore,
  InitOptions,
  Plugin,
  EnvironmentHandlers,
  CookieOptions,
} from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '../config';

/**
 * Options for initializing the SDK in Next.js App Router server context.
 * Works in Server Components, Route Handlers, and Server Actions.
 * @public
 */
export interface ServerInitOptions {
  /**
   * The Sitecore configuration object
   */
  config: SitecoreConfig;
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
  /**
   * Array of plugins to enable
   */
  plugins?: Plugin[];
  /**
   * Additional environment handlers to merge with the server defaults
   */
  environment?: EnvironmentHandlers;
}

/**
 * Creates environment handlers for Next.js App Router server context.
 *
 * @param cookiesFn - The cookies() function from next/headers
 * @param headersFn - The headers() function from next/headers (optional)
 * @returns Environment handlers configured for server context
 * @internal
 */
function createServerEnvironment(
  cookiesFn: ServerInitOptions['cookies'],
  headersFn?: ServerInitOptions['headers']
): EnvironmentHandlers {
  return {
    getCookie: (name: string): string | undefined => {
      try {
        return cookiesFn().get(name)?.value;
      } catch {
        // cookies() can throw in certain contexts
        return undefined;
      }
    },
    setCookie: (name: string, value: string, options?: CookieOptions): void => {
      try {
        cookiesFn().set(name, value, options);
      } catch {
        // setCookie may fail after response has started streaming
      }
    },
    deleteCookie: (name: string): void => {
      try {
        cookiesFn().delete(name);
      } catch {
        // deleteCookie may fail in certain contexts
      }
    },
    getHeader: headersFn
      ? (name: string): string | undefined => {
          try {
            return headersFn().get(name) ?? undefined;
          } catch {
            return undefined;
          }
        }
      : () => undefined,
  };
}

/**
 * Initializes the Sitecore SDK for use in Next.js App Router server contexts.
 * Works in Server Components, Route Handlers, and Server Actions.
 *
 * @example
 * ```typescript
 * // app/layout.tsx or any Server Component
 * import { cookies, headers } from 'next/headers';
 * import { initServer } from '@sitecore-content-sdk/nextjs/init';
 * import config from './sitecore.config';
 *
 * export default async function RootLayout({ children }) {
 *   await initServer({
 *     config,
 *     cookies,
 *     headers,
 *     plugins: [eventsPlugin()]
 *   });
 *
 *   return <html>...</html>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // app/api/example/route.ts
 * import { cookies } from 'next/headers';
 * import { initServer } from '@sitecore-content-sdk/nextjs/init';
 *
 * export async function GET() {
 *   await initServer({ config, cookies });
 *   // ...
 * }
 * ```
 *
 * @param options - Server initialization options
 * @returns Promise that resolves when initialization is complete
 * @public
 */
export async function initServer(options: ServerInitOptions): Promise<void> {
  const { config, cookies, headers, plugins = [], environment = {} } = options;

  // Create server-specific environment handlers
  const serverEnvironment = createServerEnvironment(cookies, headers);

  // Merge with any custom handlers (custom handlers take precedence)
  const mergedEnvironment: EnvironmentHandlers = {
    ...serverEnvironment,
    ...environment,
  };

  const initOptions: InitOptions = {
    config,
    plugins,
    environment: mergedEnvironment,
  };

  await initSitecoreCore(initOptions);
}

