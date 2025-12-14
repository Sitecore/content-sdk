import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Skip middlewares only if neither Edge nor local API configuration is available.
  // Middlewares can work with either Edge (contextId) or local (apiHost/apiKey) configuration.
  if (!scConfig.api?.edge?.contextId && !scConfig.api?.local?.apiHost) {
    return NextResponse.next();
  }

  // Instantiate middlewares - they will use Edge config if available, otherwise fall back to local config
  const multisite = new MultisiteMiddleware({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.multisite,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge middleware runs on every request.
    skip: () => false,
  });

  const redirects = new RedirectsMiddleware({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.api.local,
    ...scConfig.redirects,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge middleware runs on every request.
    skip: () => false,
  });

  const personalize = new PersonalizeMiddleware({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge middleware runs on every request
    skip: () => false,
    // This is an example of how to provide geo data for personalization.
    // The provided callback will be called on each request to extract geo data.
    // extractGeoDataCb: () => {
    //   return {
    //     city: 'Athens',
    //     country: 'Greece',
    //     region: 'Attica',
    //   };
    // },
  });

  return defineMiddleware(multisite, redirects, personalize).exec(req, ev);
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
