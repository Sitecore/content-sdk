import { type NextRequest, type NextFetchEvent } from 'next/server';
import {
  defineMiddleware,
  MultisiteMiddleware,
  PersonalizeMiddleware,
  RedirectsMiddleware,
} from '@sitecore-content-sdk/nextjs/middleware';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';
import scConfig from 'temp/config';

const multisite = new MultisiteMiddleware({
  // This function determines if the middleware should be turned off.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => false,
  // Site resolver implementation
  siteResolver,
  // This function allows resolving site from sc_site cookie, which could be useful in case of Vercel preview URLs. Accepts NextRequest.
  useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
});

const redirects = new RedirectsMiddleware({
  // Client factory implementation
  clientFactory,
  // These are all the locales you support in your application.
  // These should match those in your next.config.js (i18n.locales).
  locales: ['en'],
  // This function determines if the middleware should be turned off.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => process.env.NODE_ENV === 'development',
  // Site resolver implementation
  siteResolver,
});

const personalize = new PersonalizeMiddleware({
  // Configuration for your Sitecore Experience Edge endpoint
  edgeConfig: {
    clientFactory,
    timeout:
      (process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT)) ||
      400,
  },
  // Configuration for your Sitecore CDP endpoint
  cdpConfig: {
    sitecoreEdgeUrl: scConfig.sitecoreEdgeUrl,
    sitecoreEdgeContextId: scConfig.sitecoreEdgeContextId,
    timeout:
      (process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT &&
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT)) ||
      400,
  },
  // Optional Sitecore Personalize scope identifier.
  scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
  // This function determines if the middleware should be turned off.
  // IMPORTANT: You should implement based on your cookie consent management solution of choice.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // You may wish to keep it disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  disabled: () => process.env.NODE_ENV === 'development',
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
