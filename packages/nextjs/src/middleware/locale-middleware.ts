/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { debug } from '@sitecore-content-sdk/core';
import { getLocaleRewrite } from '@sitecore-content-sdk/core/i18n';
import { MiddlewareBase, MiddlewareBaseConfig, LOCALE_HEADER_NAME } from './middleware';

export type LocaleMiddlewareConfig = MiddlewareBaseConfig & {
  locales: string[];
};

export class LocaleMiddleware extends MiddlewareBase {
  private locales: string[];
  /**
   * @param {LocaleMiddlewareConfig} [config] Locale middleware config
   */
  constructor(protected config: LocaleMiddlewareConfig) {
    super(config);
    this.locales = config.locales;
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
      const { pathname } = req.nextUrl;

      const localeFromPath = this.getLocaleFromPath(pathname);
      const locale = localeFromPath || this.config.defaultLanguage || 'en';

      debug.locale('locale middleware start: %o', {
        pathname,
        locale,
      });

      if (this.disabled(req, res)) {
        debug.locale('skipped (locale middleware is disabled)');
        return res;
      }

      if (!localeFromPath) {
        // locale is not present in path, we need to rewrite to include the locale segment
        const rewritePath = getLocaleRewrite(pathname, locale);
        const response = this.rewrite(rewritePath, req, res);
        this.setLocaleHeader(response, locale);

        debug.locale('locale middleware end, with rewrite: %o', {
          pathname,
          locale,
          rewritePath,
        });

        return response;
      }

      this.setLocaleHeader(res, locale);

      debug.locale('locale middleware end, no rewrite: %o', {
        pathname,
        locale,
      });

      return res;
    } catch (error) {
      console.log('Locale middleware failed:');
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
    return this.locales.find(
      (locale) => path.includes(`/${locale}/`) || path.endsWith(`/${locale}`)
    );
  }

  private setLocaleHeader(res: NextResponse, locale: string) {
    res.headers.set(LOCALE_HEADER_NAME, locale);
  }
}
