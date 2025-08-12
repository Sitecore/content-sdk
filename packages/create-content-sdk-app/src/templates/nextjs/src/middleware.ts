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
  // If no Edge server contextId, skip Edge middlewares entirely.
  // (SSR/API can still use Local creds; no crash in Edge runtime.)
  if (!scConfig.api?.edge?.contextId) {
    return NextResponse.next();
  }

  // Instantiate AFTER the guard so constructors don’t run in local-only mode
  const multisite = new MultisiteMiddleware({
    sites,
    ...scConfig.api.edge,
    ...scConfig.multisite,
    skip: () => false,
  });

  const redirects = new RedirectsMiddleware({
    sites,
    ...scConfig.api.edge,
    ...scConfig.redirects,
    skip: () => false,
  });

  const personalize = new PersonalizeMiddleware({
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    skip: () => false,
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


