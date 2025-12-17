import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { initSitecore, InitConfig, Plugin, isInitialized } from '@sitecore-content-sdk/core';
import { SiteInfo } from '@sitecore-content-sdk/core/site';
import { personalizePluginServer } from '@sitecore-content-sdk/personalize/plugin';
import {
  multisitePlugin,
  MultisitePluginSettings,
  personalizeMiddlewarePlugin,
  PersonalizeMiddlewarePluginSettings,
  executeMiddlewares,
  ExecuteMiddlewaresOptions,
  MULTISITE_PLUGIN_NAME,
  PERSONALIZE_MIDDLEWARE_PLUGIN_NAME,
} from '../middleware';

/**
 * Configuration for the Sitecore middleware setup.
 * @public
 */
export interface SitecoreMiddlewareConfig {
  /**
   * Core SDK configuration
   */
  config: InitConfig;
  /**
   * List of sites for site resolution (used by multisite and personalize)
   */
  sites: SiteInfo[];
  /**
   * Multisite middleware settings (optional - omit to disable)
   */
  multisite?: Omit<MultisitePluginSettings, 'sites'>;
  /**
   * Personalize middleware settings (optional - omit to disable)
   */
  personalize?: Omit<PersonalizeMiddlewarePluginSettings, 'sites'>;
  /**
   * Additional plugins to register alongside the middleware plugins
   */
  additionalPlugins?: Plugin[];
  /**
   * Order of middleware execution (optional - uses default order if not specified)
   */
  middlewareOrder?: string[];
}

// Store the config for use in the handler
let storedConfig: SitecoreMiddlewareConfig | null = null;
let storedMiddlewareOrder: string[] | undefined;

/**
 * Initializes the Sitecore SDK with middleware plugins.
 *
 * This function automatically:
 * 1. Registers the middleware plugins you specify (multisite, personalize)
 * 2. Adds required dependency plugins (e.g., personalizePluginServer for personalize middleware)
 * 3. Sets up the correct plugin order
 *
 * Call this function once at module load time (outside any request handler).
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { initSitecoreMiddleware, sitecoreMiddleware } from '@sitecore-content-sdk/nextjs/init';
 * import sites from '.sitecore/sites.json';
 * import scConfig from 'sitecore.config';
 *
 * // Initialize once at module load
 * initSitecoreMiddleware({
 *   config: {
 *     sitecoreContextId: scConfig.api.edge?.contextId,
 *     sitecoreEdgeUrl: scConfig.api.edge?.edgeUrl,
 *   },
 *   sites,
 *   multisite: {
 *     ...scConfig.multisite,
 *   },
 *   personalize: {
 *     ...scConfig.personalize,
 *   },
 * });
 *
 * // Export the middleware handler
 * export const middleware = sitecoreMiddleware();
 * ```
 *
 * @param middlewareConfig - Configuration for middleware plugins
 * @public
 */
export function initSitecoreMiddleware(middlewareConfig: SitecoreMiddlewareConfig): void {
  const {
    config,
    sites,
    multisite,
    personalize,
    additionalPlugins = [],
    middlewareOrder,
  } = middlewareConfig;

  // Store config for later use
  storedConfig = middlewareConfig;
  storedMiddlewareOrder = middlewareOrder;

  // Build the plugins array based on what's enabled
  const plugins: Plugin[] = [];
  const enabledMiddlewares: string[] = [];

  // Add multisite plugin if configured
  if (multisite) {
    plugins.push(
      multisitePlugin({
        sites,
        ...multisite,
      })
    );
    enabledMiddlewares.push(MULTISITE_PLUGIN_NAME);
  }

  // Add personalize plugins if configured
  // The personalize middleware requires the personalize plugin for guest ID management
  if (personalize) {
    // Add the dependency plugin first (handles guest ID cookie)
    plugins.push(personalizePluginServer());

    // Add the middleware plugin
    plugins.push(
      personalizeMiddlewarePlugin({
        sites,
        ...personalize,
      })
    );
    enabledMiddlewares.push(PERSONALIZE_MIDDLEWARE_PLUGIN_NAME);
  }

  // Add any additional plugins
  plugins.push(...additionalPlugins);

  // Store the middleware order (use provided order or default based on what's enabled)
  if (!middlewareOrder) {
    storedMiddlewareOrder = enabledMiddlewares;
  }

  // Initialize the SDK
  initSitecore({
    config,
    plugins,
  });
}

/**
 * Options for the sitecoreMiddleware handler.
 * @public
 */
export interface SitecoreMiddlewareOptions {
  /**
   * Function to determine if middleware should be skipped for this request.
   * Return true to skip all middleware and return NextResponse.next().
   */
  skip?: (req: NextRequest) => boolean;
}

/**
 * Creates a Next.js middleware handler that executes all configured Sitecore middlewares.
 *
 * This function returns a middleware handler that:
 * 1. Sets up environment handlers (getCookie, setCookie, etc.)
 * 2. Triggers deferred inits (creates browser ID / guest ID cookies)
 * 3. Executes each configured middleware in order
 *
 * @example
 * ```typescript
 * // Simple usage
 * export const middleware = sitecoreMiddleware();
 *
 * // With skip logic
 * export const middleware = sitecoreMiddleware({
 *   skip: (req) => req.nextUrl.pathname.startsWith('/api'),
 * });
 * ```
 *
 * @param options - Optional configuration for the middleware handler
 * @returns A Next.js middleware handler function
 * @public
 */
export function sitecoreMiddleware(
  options: SitecoreMiddlewareOptions = {}
): (req: NextRequest, ev: NextFetchEvent) => Promise<NextResponse> {
  const { skip } = options;

  return async (req: NextRequest, ev: NextFetchEvent): Promise<NextResponse> => {
    // Check if SDK is initialized
    if (!isInitialized()) {
      console.warn(
        '[Sitecore Middleware] SDK not initialized. Call initSitecoreMiddleware() first.'
      );
      return NextResponse.next();
    }

    // Check skip condition
    if (skip && skip(req)) {
      return NextResponse.next();
    }

    // Execute all configured middlewares
    const executeOptions: ExecuteMiddlewaresOptions = {};
    if (storedMiddlewareOrder) {
      executeOptions.order = storedMiddlewareOrder;
    }

    return executeMiddlewares(req, ev, executeOptions);
  };
}

/**
 * Re-export for convenience
 */
export { executeMiddlewares, ExecuteMiddlewaresOptions };

