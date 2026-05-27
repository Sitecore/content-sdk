/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { getSiteRewrite, SITE_KEY } from '@sitecore-content-sdk/content/site';
import { ProxiesContext, ProxyBase, ProxyBaseConfig, REWRITE_HEADER_NAME } from './proxy';
import { SitecoreConfig } from '../config';
import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution with details about the multisite that was applied
 * @public
 */
export interface SuccessfulMultisiteProxyExecution extends SuccessfulProxyExecution {
  rewritePath: string;
  siteName: string;
  isSitecorePreview: string | undefined;
}

import debug from '../debug';
import { FailedProxyExecution, SuccessfulProxyExecution } from './types';

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
 * The interface for the MultisiteProxy configuration.
 * @public
 */
export type MultisiteProxyConfig = ProxyBaseConfig & SitecoreConfig['multisite'];

/**
 * Proxy / handler for multisite support
 * @public
 */
export class MultisiteProxy extends ProxyBase {
  private _name = 'MultisiteProxy';

  /**
   * @param {MultisiteProxyConfig} [config] Multisite proxy config
   */
  constructor(protected config: MultisiteProxyConfig) {
    super(config);
  }

  /**
   * Name of the proxy, used for debugging and context information.
   */
  get name() {
    return this._name;
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    context?: ProxiesContext
  ): Promise<NextResponse> => {
    try {
      // Path can be rewritten by previously executed proxy
      const pathname = res?.headers.get(REWRITE_HEADER_NAME) || req.nextUrl.pathname;
      const language = this.getLanguage(req, res);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      const startTimestamp = Date.now();

      debug.multisite('multisite proxy start: %o', {
        pathname,
        language,
        hostname,
      });

      // We can't skip site name preservation for App Router in Preview since currently we rely on the site segment
      // to be present in the path.
      // Additionally, App Router route structure always requires [site] segment, so disabling multisite
      // will break regular requests even though Preview/Editing modes will still work.

      if (this.isPreview(req) && !this.isAppRouter(res)) {
        debug.multisite('skipped (preview)');

        return res;
      }

      // Site name preservation is required for Sitecore Preview mode to support navigation between pages
      const isSitecorePreview = req.cookies.get(PREVIEW_KEY)?.value;

      if (!isSitecorePreview) {
        if (!this.config.enabled) {
          this.shouldWarnWhenDisabled(res);
          if (this.shouldSkipWhenDisabled()) {
            debug.multisite('skipped (multisite proxy is disabled globally)');
            return res;
          }
          // Continue execution if shouldSkipWhenDisabled returns false (App Router case)
        }

        if (this.disabled(req, res)) {
          debug.multisite('skipped (multisite proxy is disabled)');

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

      // Share site name with the following executed proxies
      response.cookies.set(SITE_KEY, siteName, defaultCookieAttributes);

      debug.multisite('multisite proxy end in %dms: %o', Date.now() - startTimestamp, {
        rewritePath,
        siteName,
        headers: this.extractDebugHeaders(response.headers),
        cookies: response.cookies,
      });

      const successfulExecution: SuccessfulMultisiteProxyExecution = {
        executedSuccessfully: true,
        error: null,
        rewritePath,
        siteName,
        isSitecorePreview,
      };

      context?.set(this._name, successfulExecution);

      return response;
    } catch (error) {
      console.log('Multisite proxy failed:');
      console.log(error);

      const failedExecution: FailedProxyExecution = {
        executedSuccessfully: false,
        error,
      };

      context?.set(this._name, failedExecution);
      return res;
    }
  };

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }

  /**
   * Called when multisite is disabled. Override this method in subclasses to show router-specific warnings.
   * @param {NextResponse} _res response
   */
  // eslint-disable-next-line no-unused-vars
  protected shouldWarnWhenDisabled(_res: NextResponse): void {
    // Base implementation does nothing - subclasses can override to show warnings
  }

  /**
   * Determines if proxy should be skipped when multisite is disabled.
   * Override in subclasses to provide router-specific behavior.
   * @returns {boolean} true if proxy should be skipped when disabled
   */
  protected shouldSkipWhenDisabled(): boolean {
    return true; // Base class skips when disabled
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
