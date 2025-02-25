import { type NextRequest, type NextFetchEvent } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import sites from 'temp/sites';
import clientFactory from 'lib/graphql-client-factory';
import scConfig from 'sitecore.config';

const multisite = new MultisiteMiddleware({
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
});

const redirects = new RedirectsMiddleware({
  // Client factory implementation
  clientFactory,
  sites,
  ...scConfig.api.edge,
  ...scConfig.redirects,
});

const personalize = new PersonalizeMiddleware({
  // Client factory implementation
  clientFactory,
  sites,
  ...scConfig.api.edge,
  ...scConfig.personalize,
});

export function middleware(req: NextRequest, ev: NextFetchEvent) {
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
