import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';
import { initSitecoreMiddleware, executeMiddlewares } from '@sitecore-content-sdk/nextjs/init';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

/**
 * Initialize Sitecore middleware once at module load time.
 *
 * This automatically:
 * - Registers the middleware plugins you specify (multisite, personalize)
 * - Adds required dependency plugins (e.g., personalizePluginServer)
 * - Configures the correct plugin order
 */
initSitecoreMiddleware({
  config: {
    sitecoreContextId: scConfig.api.edge?.contextId,
    sitecoreEdgeUrl: scConfig.api.edge?.edgeUrl,
  },
  sites,
  // Multisite middleware - handles site resolution and rewrites
  multisite: {
    ...scConfig.multisite,
  },
  // Personalize middleware - handles personalization decisions and rewrites
  // The personalize plugin (for guest ID cookies) is automatically added as a dependency
  personalize: {
    ...scConfig.personalize,
    // Example: Provide geo data for personalization
    // extractGeoDataCb: () => ({
    //   city: 'Athens',
    //   country: 'Greece',
    //   region: 'Attica',
    // }),
  },
});

/**
 * Next.js middleware function.
 * Executes on every request matching the config.matcher pattern.
 */
export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Skip if no API configuration is available
  if (!scConfig.api?.edge?.contextId && !scConfig.api?.local?.apiHost) {
    return NextResponse.next();
  }

  // Execute all Sitecore middlewares (multisite, personalize, etc.)
  // This automatically:
  // 1. Sets up environment handlers (getCookie, setCookie, etc.)
  // 2. Triggers deferred inits (creates browser ID / guest ID cookies)
  // 3. Executes each configured middleware in order
  return executeMiddlewares(req, ev);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: ['/', '/((?!api/|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)'],
};
