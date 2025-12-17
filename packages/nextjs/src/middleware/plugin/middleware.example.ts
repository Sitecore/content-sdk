/**
 * Example of how middleware.ts could look with all middlewares as plugins.
 * This demonstrates the plugin-based approach to middleware configuration.
 *
 * Key Benefits:
 * 1. Single initialization point for all middleware config
 * 2. Automatic deferred init when environment is updated
 * 3. Plugin enable/disable via updatePluginSettings (e.g., for cookie consent)
 * 4. Consistent pattern with events/personalize tracking plugins
 */

import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';
import { initSitecore, updateEnvironment } from '@sitecore-content-sdk/core';
import { eventsPluginServer } from '@sitecore-content-sdk/events/plugin';
import {
  multisitePlugin,
  personalizeMiddlewarePlugin,
  executeMiddlewares,
} from '@sitecore-content-sdk/nextjs/middleware';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

/**
 * Initialize SDK once at module load time (outside the middleware function).
 * This ensures plugins are registered only once, not on every request.
 *
 * Note: We don't provide environment handlers here because we don't have
 * access to request/response yet. Environment will be updated inside the
 * middleware function.
 */
initSitecore({
  config: {
    sitecoreContextId: scConfig.api.edge?.contextId,
    sitecoreEdgeUrl: scConfig.api.edge?.edgeUrl,
  },
  plugins: [
    // Multisite middleware plugin - handles site resolution and rewrites
    multisitePlugin({
      sites,
      enabled: scConfig.multisite?.enabled,
      defaultHostname: 'localhost',
      useCookieResolution: scConfig.multisite?.useCookieResolution,
      skip: () => false,
    }),

    // Personalize middleware plugin - handles personalization
    personalizeMiddlewarePlugin({
      sites,
      enabled: scConfig.personalize?.enabled,
      contextId: scConfig.api.edge?.contextId,
      edgeUrl: scConfig.api.edge?.edgeUrl,
      cdpTimeout: scConfig.personalize?.cdpTimeout,
      scope: scConfig.personalize?.scope,
      skip: () => false,
    }),

    // Events plugin - handles browser ID cookie management
    // This is separate from the middleware plugins as it handles tracking
    eventsPluginServer({
      enabled: true, // Or based on cookie consent
    }),

    // Future: Redirects middleware plugin
    // redirectsMiddlewarePlugin({
    //   sites,
    //   enabled: scConfig.redirects?.enabled,
    //   locales: scConfig.redirects?.locales,
    // }),
  ],
});

/**
 * Next.js middleware function.
 * This runs on every request that matches the config.matcher pattern.
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Skip if no API configuration is available
  if (!scConfig.api?.edge?.contextId && !scConfig.api?.local?.apiHost) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Update environment with request/response handlers.
  // This triggers deferred inits for all enabled plugins that need environment handlers.
  await updateEnvironment({
    getCookie: (name) => req.cookies.get(name)?.value,
    setCookie: (name, value, options) =>
      response.cookies.set(name, value, {
        ...options,
        secure: true,
        sameSite: 'none',
      }),
    deleteCookie: (name) => response.cookies.delete(name),
    getHeader: (name) => req.headers.get(name) ?? undefined,
    getPathname: () => req.nextUrl.pathname,
  });

  // Execute all enabled middleware plugins in order
  // This is equivalent to: defineMiddleware(multisite, redirects, personalize).exec(req, ev)
  return executeMiddlewares(req, ev, { response });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes (/api)
     * - Next.js internals (/_next)
     * - Sitecore API routes (/sitecore/api)
     * - Sitecore media (/-)
     * - Health check (/healthz)
     * - Static files (files with extensions)
     */
    '/((?!api/|_next/|sitecore/api/|-/|healthz|[^/]+\\.[^/]+$).*)',
  ],
};

