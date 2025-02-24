import { type NextRequest, type NextFetchEvent } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import scConfig from 'sitecore.config';

const multisite = new MultisiteMiddleware({
  // This function determines if the middleware should be turned off.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => scConfig.multisite.enabled !== true,
  // Site resolver implementation
  siteResolver,
  // This function allows resolving site from sc_site cookie, which could be useful in case of Vercel preview URLs. Accepts NextRequest.
  useCookieResolution: scConfig.multisite.useCookieResolution,
});

const redirects = new RedirectsMiddleware({
  // Client factory implementation
  clientFactory,
  // These are all the locales you support in your application.
  // These should match those in your next.config.js (i18n.locales).
  locales: scConfig.redirects.locales,
  // This function determines if the middleware should be turned off.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => scConfig.redirects.enabled !== true,
  // Site resolver implementation
  siteResolver,
});

const personalize = new PersonalizeMiddleware({
  // Configuration for your Sitecore Experience Edge endpoint
  edgeConfig: {
    clientFactory,
    timeout: scConfig.personalize.edgeTimeout,
  },
  // Configuration for your Sitecore CDP endpoint
  cdpConfig: {
    sitecoreEdgeUrl: scConfig.api.edge.edgeUrl,
    sitecoreEdgeContextId: scConfig.api.edge.contextId,
    timeout: scConfig.personalize.cdpTimeout,
  },
  // Optional Sitecore Personalize scope identifier.
  scope: scConfig.personalize.scope,
  // This function determines if the middleware should be turned off.
  // IMPORTANT: You should implement based on your cookie consent management solution of choice.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // You may wish to keep it disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => scConfig.personalize.enabled !== true,
  // Site resolver implementation
  siteResolver,
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
