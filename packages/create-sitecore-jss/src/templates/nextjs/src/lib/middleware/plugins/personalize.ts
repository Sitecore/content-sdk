import { NextRequest, NextResponse } from 'next/server';
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import { MiddlewarePlugin } from '..';
import clientFactory from 'lib/graphql-client-factory';
import { runtimeConfig as config } from '@sitecore-jss/sitecore-jss-nextjs/config';
import { siteResolver } from 'lib/site-resolver';

/**
 * This is the personalize middleware plugin for Next.js.
 * It is used to enable Sitecore personalization and A/B testing of pages in Next.js.
 *
 * The `PersonalizeMiddleware` will
 *  1. Call Sitecore Experience Edge to get the personalization information about the page.
 *  2. Based on the response, call Sitecore Personalize (with request/user context) to determine the page / component variant(s).
 *  3. Rewrite the response to the specific page / component variant(s).
 */
class PersonalizePlugin implements MiddlewarePlugin {
  private personalizeMiddleware: PersonalizeMiddleware;

  // Using 1 to leave room for things like redirects to occur first
  order = 1;

  constructor() {
    console.log(JSON.stringify(config));
    this.personalizeMiddleware = new PersonalizeMiddleware({
      // Configuration for your Sitecore Experience Edge endpoint
      edgeConfig: {
        clientFactory,
        timeout: config.personalize.edgeTimeout || 400,
      },
      // Configuration for your Sitecore CDP endpoint
      cdpConfig: {
        sitecoreEdgeUrl: config.api.edgeUrl,
        sitecoreEdgeContextId: config.api.contextId,
        timeout: config.personalize.cdpTimeout || 400,
      },
      // Optional Sitecore Personalize scope identifier.
      scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
      // This function determines if the middleware should be turned off.
      // IMPORTANT: You should implement based on your cookie consent management solution of choice.
      // You may wish to keep it disabled while in development mode.
      disabled: () => process.env.NODE_ENV === 'development',
      // This function determines if a route should be excluded from personalization.
      // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to exclude more.
      // This is an important performance consideration since Next.js Edge middleware runs on every request.
      excludeRoute: () => false,
      // Site resolver implementation
      siteResolver,
    });
  }

  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    return this.personalizeMiddleware.getHandler()(req, res);
  }
}

export const personalizePlugin = new PersonalizePlugin();
