/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { getSiteRewrite, SITE_KEY } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { MiddlewareBase, MiddlewareBaseConfig, REWRITE_HEADER_NAME } from './middleware';
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

/**
 * The interface for the MultisiteMiddleware configuration.
 * @public
 */
export type MultisiteMiddlewareConfig = MiddlewareBaseConfig & SitecoreConfig['multisite'];

/**
 * Middleware / handler for multisite support
 * @public
 */
export class MultisiteMiddleware extends MiddlewareBase {
  /**
   * @param {MultisiteMiddlewareConfig} [config] Multisite middleware config
   */
  constructor(protected config: MultisiteMiddlewareConfig) {
    super(config);
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
      // Path can be rewritten by previously executed middleware
      const pathname = res?.headers.get(REWRITE_HEADER_NAME) || req.nextUrl.pathname;
      const language = this.getLanguage(req, res);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      const startTimestamp = Date.now();

      debug.multisite('multisite middleware start: %o', {
        pathname,
        language,
        hostname,
      });

      // We can't skip site name preservation for App Router in Preview since currently we rely on the site segment
      // to be present in the path.

      if (this.isPreview(req) && !this.isAppRouter(res)) {
        debug.multisite('skipped (preview)');

        return res;
      }

      // Site name preservation is required for Sitecore Preview mode to support navigation between pages
      const isSitecorePreview = req.cookies.get(PREVIEW_KEY)?.value;

      if (!isSitecorePreview) {
        if (!this.config.enabled) {
          debug.multisite('skipped (multisite middleware is disabled globally)');
          return res;
        }

        if (this.disabled(req, res)) {
          debug.multisite('skipped (multisite middleware is disabled)');

          return res;
        }
      }

      let siteName: string;

      if (isSitecorePreview) {
        // This cookie is required to be set in the Sitecore Preview mode to support navigation
        // and preserve the site name
        siteName = req.cookies.get(SITE_KEY)?.value!;
      } else {
        // Site name can be forced by query string parameter or cookie
        // 'site' is provided when running "preview" in AppRouter
        siteName =
          req.nextUrl.searchParams.get(SITE_KEY) ||
          req.nextUrl.searchParams.get('site') ||
          (this.config.useCookieResolution &&
            this.config.useCookieResolution(req) &&
            req.cookies.get(SITE_KEY)?.value) ||
          this.siteResolver.getByHost(hostname).name;
      }

      // Rewrite to site specific path
      const rewritePath = this.getSiteRewrite(pathname, siteName);

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

  /**
   * Generates a site-specific rewrite path based on the provided pathname and site name.
   * @param {string} pathname - The pathname to be rewritten.
   * @param {string} siteName - The name of the site.
   * @returns The rewritten path as a string.
   */
  protected getSiteRewrite(pathname: string, siteName: string): string {
    return getSiteRewrite(pathname, {
      siteName,
    });
  }
}
