import { MultisiteMiddleware } from './multisite-middleware';

/**
 * Middleware/handler for enabling multisite support in the Next.js App Router.
 */
export class AppRouterMultisiteMiddleware extends MultisiteMiddleware {
  /**
   * Warns when multisite is disabled in App Router, as it will break regular requests.
   */
  protected shouldWarnWhenDisabled() {
    console.warn(
      '⚠️ Warning: Multisite is disabled but App Router requires the [site] segment in routes. ' +
        'Regular requests will fail with 404 errors. Preview/Editing modes will still work. ' +
        'For single-site setups, keep multisite enabled and configure only one site.'
    );
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
