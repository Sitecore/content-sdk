/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';
import { ProxyBase, ProxyBaseConfig, LOCALE_HEADER_NAME } from './proxy';
import debug from '../debug';

/**
 * The interface for the Locale proxy configuration.
 * @public
 */
export type LocaleProxyConfig = ProxyBaseConfig & {
  /**
   * List of locales supported by the application
   */
  locales: string[];
};

/**
 * Proxy/handler for handling locale-based routing in the Next.js App Router.
 * This proxy is responsible for extracting the locale from the request path and rewriting it if necessary.
 * It also sets the locale header in the response.
 * @public
 */
export class LocaleProxy extends ProxyBase {
  /**
   * @param {LocaleProxyConfig} config Locale proxy config
   */
  constructor(protected config: LocaleProxyConfig) {
    super(config);
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
      const { pathname } = req.nextUrl;

      const localeFromPath = this.getLocaleFromPath(pathname);
      const locale = localeFromPath || this.getLanguage(req, res);

      debug.locale('locale proxy start: %o', {
        pathname,
        locale,
      });

      if (this.disabled(req, res)) {
        debug.locale('skipped (locale proxy is disabled)');
        return res;
      }

      if (!localeFromPath) {
        // locale is not present in path, we need to rewrite to include the locale segment
        const rewritePath = getLocaleRewrite(pathname, locale);
        const response = this.rewrite(rewritePath, req, res);
        this.setLocaleHeader(response, locale);

        debug.locale('locale proxy end, with rewrite: %o', {
          pathname,
          locale,
          rewritePath,
        });

        return response;
      }

      this.setLocaleHeader(res, locale);

      debug.locale('locale proxy end, no rewrite: %o', {
        pathname,
        locale,
      });

      return res;
    } catch (error) {
      console.log('Locale proxy failed:');
      console.log(error);
      return res;
    }
  };

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }

  /**
   * Extract locale from path
   * @param {string} path request path
   * @returns {string | undefined} the locale if found
   */
  protected getLocaleFromPath(path: string): string | undefined {
    return this.config.locales.find(
      (locale) => path.includes(`/${locale}/`) || path.endsWith(`/${locale}`)
    );
  }

  private setLocaleHeader(res: NextResponse, locale: string) {
    res.headers.set(LOCALE_HEADER_NAME, locale);
  }
}
