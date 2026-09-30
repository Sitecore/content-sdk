import { NextResponse } from 'next/server';
import { MultisiteProxy } from './multisite-proxy';

/**
 * Multisite proxy that rewrites the request to include the `/[site]` path segment.
 *
 * Router-neutral: used by both the App Router and the Pages Router once the latter
 * adopts the shared `/[site]/[locale]/[[...path]]` route structure. The `[site]`
 * segment is required by that structure, so this proxy always runs (it never skips
 * when multisite is disabled) to avoid 404s on regular page requests.
 * @public
 */
export class MultisiteRewriteProxy extends MultisiteProxy {
  /**
   * Warns when multisite is disabled but the proxy still needs to run.
   * The proxy will still run to prevent routing errors.
   * @param {NextResponse} _res response (unused, kept for method signature compatibility)
   */
  // eslint-disable-next-line no-unused-vars
  protected shouldWarnWhenDisabled(_res: NextResponse): void {
    console.warn(
      '⚠️ Warning: Multisite is disabled, but the proxy will continue running. ' +
        'Disabling multisite with the `/[site]/...` route structure would cause 404 errors for regular page requests because the route structure requires the [site] segment. ' +
        'Preview/Editing modes will still work. ' +
        'For single-site setups, keep multisite enabled and configure only one site.'
    );
  }

  /**
   * With the `/[site]/...` route structure we cannot skip the proxy even if enabled is
   * false, because the route structure requires the [site] segment.
   * @returns {boolean} always returns false (never skip)
   */
  protected shouldSkipWhenDisabled(): boolean {
    return false; // Never skip - route structure requires [site] segment
  }

  /**
   * Generates a site-specific rewrite path based on the provided pathname and site name.
   * @param {string} pathname - The pathname to be rewritten.
   * @param {string} siteName - The name of the site.
   * @returns The rewritten path as a string.
   */
  protected getSiteRewrite(pathname: string, siteName: string): string {
    const path = pathname.startsWith('/') ? pathname : '/' + pathname;
    return `/${siteName}${path}`;
  }
}
