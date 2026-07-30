/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextResponse, NextRequest } from 'next/server';
import { getLocaleRewrite } from '@sitecore-content-sdk/content/i18n';
import { ProxyBase, ProxyBaseConfig, LOCALE_HEADER_NAME } from './proxy';
import debug from '../debug';
import { FailedProxyExecution, ProxiesContext, SuccessfulProxyExecution } from './types';

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution with details about the locale that was applied
 * @public
 */
export interface SuccessfulLocaleProxyExecution extends SuccessfulProxyExecution {
  rewrote: boolean;
  locale: string;
}

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

  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  get name() {
    return 'LocaleProxy';
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    proxiesContext?: ProxiesContext
  ): Promise<NextResponse> => {
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
        const rewritePath =
          locale === this.config.defaultLanguage ? pathname : getLocaleRewrite(pathname, locale);
        const response = this.rewrite(rewritePath, req, res);
        this.setLocaleHeader(response, locale);

        debug.locale('locale proxy end, with rewrite: %o', {
          pathname,
          locale,
          rewritePath,
        });

        const successfulExecution: SuccessfulLocaleProxyExecution = {
          executedSuccessfully: true,
          error: null,
          rewrote: true,
          locale,
        };

        proxiesContext?.set(this.name, successfulExecution);

        return response;
      }

      this.setLocaleHeader(res, locale);

      debug.locale('locale proxy end, no rewrite: %o', {
        pathname,
        locale,
      });

      const successfulExecution: SuccessfulLocaleProxyExecution = {
        executedSuccessfully: true,
        error: null,
        rewrote: false,
        locale,
      };

      proxiesContext?.set(this.name, successfulExecution);

      return res;
    } catch (error) {
      console.log('Locale proxy failed:');
      console.log(error);

      const failedExecution: FailedProxyExecution = {
        executedSuccessfully: false,
        error,
      };

      proxiesContext?.set(this.name, failedExecution);

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
