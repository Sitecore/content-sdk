import { NextResponse } from 'next/server';
import { MultisiteProxy } from './multisite-proxy';

/**
 * Proxy/handler for enabling multisite support in the Next.js App Router.
 * @public
 */
export class AppRouterMultisiteProxy extends MultisiteProxy {
  /**
   * Warns when multisite is disabled in App Router.
   * The proxy will still run to prevent routing errors.
   * @param {NextResponse} _res response (unused, kept for method signature compatibility)
   */
  // eslint-disable-next-line no-unused-vars
  protected shouldWarnWhenDisabled(_res: NextResponse): void {
    console.warn(
      '⚠️ Warning: Multisite is disabled in App Router configuration, but the proxy will continue running. ' +
        'Disabling multisite in App Router would cause 404 errors for regular page requests because the route structure requires the [site] segment. ' +
        'Preview/Editing modes will still work. ' +
        'For single-site setups, keep multisite enabled and configure only one site.'
    );
  }

  /**
   * In App Router, we cannot skip the proxy even if enabled is false,
   * because the route structure requires the [site] segment.
   * @returns {boolean} always returns false (never skip) for App Router
   */
  protected shouldSkipWhenDisabled(): boolean {
    return false; // Never skip in App Router - route structure requires [site] segment
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