/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { getSiteRewrite, SITE_KEY } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { MiddlewareBase, MiddlewareBaseConfig } from './middleware';
import { SitecoreConfig } from '../config';
import { PREVIEW_KEY } from '@sitecore-content-sdk/core/editing';

export type CookieAttributes = {
  /**
   * the Secure attribute of the site cookie
   */
  secure: boolean;
  /**
   * the HttpOnly attribute of the site cookie
   */
  httpOnly: boolean;
  /**
   * the SameSite attribute of the site cookie
   */
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
};

export type MultisiteMiddlewareConfig = MiddlewareBaseConfig & SitecoreConfig['multisite'];

/**
 * Middleware / handler for multisite support
 */
export class MultisiteMiddleware extends MiddlewareBase {
  /**
   * @param {MultisiteMiddlewareConfig} [config] Multisite middleware config
   */
  constructor(protected config: MultisiteMiddlewareConfig) {
    super(config);
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    if (!this.config.enabled) {
      debug.multisite('skipped (multisite middleware is disabled globally)');
      return res;
    }
    try {
      const pathname = req.nextUrl.pathname;
      const language = this.getLanguage(req);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      const startTimestamp = Date.now();

      debug.multisite('multisite middleware start: %o', {
        pathname,
        language,
        hostname,
      });

      if (this.disabled(req, res)) {
        debug.multisite('skipped (multisite middleware is disabled)');

        return res;
      }

      if (this.isPreview(req)) {
        debug.multisite('skipped (preview)');

        return res;
      }

      let siteName: string;

      const isSitecorePreview = req.cookies.get(PREVIEW_KEY)?.value;

      if (isSitecorePreview) {
        // This cookie is required to be set in the Sitecore Preview mode
        siteName = req.cookies.get(SITE_KEY)?.value!;
      } else {
        // Site name can be forced by query string parameter or cookie
        siteName =
          req.nextUrl.searchParams.get(SITE_KEY) ||
          (this.config.useCookieResolution &&
            this.config.useCookieResolution(req) &&
            req.cookies.get(SITE_KEY)?.value) ||
          this.siteResolver.getByHost(hostname).name;
      }

      // Rewrite to site specific path
      const rewritePath = getSiteRewrite(pathname, {
        siteName,
      });

      const response = this.rewrite(rewritePath, req, res);

      // default site cookie attributes
      const defaultCookieAttributes = {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      } as CookieAttributes;

      // Share site name with the following executed middlewares
      response.cookies.set(SITE_KEY, siteName, defaultCookieAttributes);

      debug.multisite('multisite middleware end in %dms: %o', Date.now() - startTimestamp, {
        rewritePath,
        siteName,
        headers: this.extractDebugHeaders(response.headers),
        cookies: response.cookies,
      });

      return response;
    } catch (error) {
      console.log('Multisite middleware failed:');
      console.log(error);
      return res;
    }
  };

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }
}
