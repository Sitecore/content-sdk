import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { debug, isPluginEnabled, updateEnvironment } from '@sitecore-content-sdk/core';
import { Middleware } from '../middleware';
import { getMultisiteMiddleware, MULTISITE_PLUGIN_NAME } from './multisite-plugin';
import {
  getPersonalizeMiddleware,
  PERSONALIZE_MIDDLEWARE_PLUGIN_NAME,
} from './personalize-middleware-plugin';
import { createMiddlewareEnvironment } from '../../init';

/**
 * Options for middleware execution
 * @public
 */
export interface ExecuteMiddlewaresOptions {
  /**
   * Order of middleware execution.
   * If not specified, uses default order: multisite -> redirects -> personalize
   */
  order?: string[];
  /**
   * Initial response to start the chain with.
   * If not provided, NextResponse.next() is used.
   */
  response?: NextResponse;
}

/**
 * Default order of middleware execution
 */
const DEFAULT_MIDDLEWARE_ORDER = [
  MULTISITE_PLUGIN_NAME,
  // Future: REDIRECTS_PLUGIN_NAME,
  PERSONALIZE_MIDDLEWARE_PLUGIN_NAME,
];

/**
 * Gets the middleware instance for a given plugin name.
 * @internal
 */
function getMiddlewareForPlugin(pluginName: string): Middleware | null {
  switch (pluginName) {
    case MULTISITE_PLUGIN_NAME:
      return getMultisiteMiddleware();
    case PERSONALIZE_MIDDLEWARE_PLUGIN_NAME:
      return getPersonalizeMiddleware();
    // Future: case REDIRECTS_PLUGIN_NAME:
    //   return getRedirectsMiddleware();
    default:
      return null;
  }
}

/**
 * Executes all registered and enabled middleware plugins in order.
 *
 * This function provides the same functionality as `defineMiddleware(...).exec()`,
 * but works with the plugin system. It chains middleware execution, passing the
 * response from one middleware to the next.
 *
 * This function automatically:
 * 1. Sets up environment handlers (getCookie, setCookie, etc.) from the request/response
 * 2. Triggers deferred inits for all enabled plugins (e.g., creates browser ID / guest ID cookies)
 * 3. Executes each middleware in order
 *
 * Middlewares are only executed if:
 * 1. The plugin is registered (was passed to initSitecore)
 * 2. The plugin is enabled (settings.enabled !== false)
 *
 * @example
 * ```typescript
 * import { initSitecore } from '@sitecore-content-sdk/core';
 * import { personalizePluginServer } from '@sitecore-content-sdk/personalize/plugin';
 * import {
 *   multisitePlugin,
 *   personalizeMiddlewarePlugin,
 *   executeMiddlewares,
 * } from '@sitecore-content-sdk/nextjs/middleware';
 *
 * // Initialize once at module level
 * initSitecore({
 *   config: { sitecoreContextId: 'your-context-id' },
 *   plugins: [
 *     multisitePlugin({ sites }),
 *     personalizePluginServer(),
 *     personalizeMiddlewarePlugin({ sites }),
 *   ]
 * });
 *
 * export async function middleware(req: NextRequest, ev: NextFetchEvent) {
 *   // executeMiddlewares handles environment setup and deferred inits automatically
 *   return executeMiddlewares(req, ev);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Custom middleware order
 * return executeMiddlewares(req, ev, {
 *   order: ['@sitecore-content-sdk/nextjs/personalize-middleware', '@sitecore-content-sdk/nextjs/multisite'],
 * });
 * ```
 *
 * @param req - The Next.js request object
 * @param ev - The Next.js fetch event (for waitUntil support)
 * @param options - Optional execution options
 * @returns The final response after all middlewares have executed
 * @public
 */
export async function executeMiddlewares(
  req: NextRequest,
  ev: NextFetchEvent,
  options: ExecuteMiddlewaresOptions = {}
): Promise<NextResponse> {
  const { order = DEFAULT_MIDDLEWARE_ORDER, response: initialResponse } = options;

  let response = initialResponse || NextResponse.next();

  debug.common('middleware plugins execution start');
  const start = Date.now();

  // Set up environment handlers and trigger deferred inits (e.g., create cookies)
  // This must happen before middleware execution so cookies are available
  await updateEnvironment(createMiddlewareEnvironment(req, response));

  for (const pluginName of order) {
    // Skip if plugin is not enabled
    if (!isPluginEnabled(pluginName)) {
      debug.common('skipping disabled middleware plugin: %s', pluginName);
      continue;
    }

    const middleware = getMiddlewareForPlugin(pluginName);
    if (!middleware) {
      debug.common('middleware not found for plugin: %s', pluginName);
      continue;
    }

    debug.common('executing middleware plugin: %s', pluginName);
    response = await middleware.handle(req, response, ev);

    // If there's a redirect, stop the chain
    if (response.headers.get('Location')) {
      debug.common('middleware chain stopped due to redirect');
      break;
    }
  }

  debug.common('middleware plugins execution end in %dms', Date.now() - start);

  return response;
}

