import { NextResponse } from 'next/server';
import { MultisiteMiddleware } from './multisite-middleware';

/**
 * Middleware/handler for enabling multisite support in the Next.js App Router.
 */
export class AppRouterMultisiteMiddleware extends MultisiteMiddleware {
  /**
   * Always warn when multisite is disabled in App Router, as it will break regular requests.
   * @param {NextResponse} _res response (unused, kept for method signature compatibility)
   * @returns {boolean} always returns true for App Router
   */
  // eslint-disable-next-line no-unused-vars
  protected shouldWarnWhenDisabled(_res: NextResponse): boolean {
    return true;
  }

  /**
   * Generates a site-specific rewrite path for app router based on the provided pathname and site name.
   * @param {string} pathname - The pathname to be rewritten.
   * @param {string} siteName - The name of the site.
   * @returns The rewritten path as a string.
   */
  protected getSiteRewrite(pathname: string, siteName: string): string {
    const path = pathname.startsWith('/') ? pathname : '/' + pathname;
    return `/${siteName}${path}`;
  }
}
