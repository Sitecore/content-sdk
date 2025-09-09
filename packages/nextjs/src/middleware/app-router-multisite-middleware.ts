import { MultisiteMiddleware } from './multisite-middleware';

/**
 * Middleware/handler for enabling multisite support in the Next.js App Router.
 */
export class AppRouterMultisiteMiddleware extends MultisiteMiddleware {
  /**
   * Generates a site-specific rewrite path for app router based on the provided pathname and site name.
   * @param {string} pathname - The pathname to be rewritten.
   * @param {string} siteName - The name of the site.
   * @returns The rewritten path as a string.
   */
  protected getSiteRewrite(pathname: string, siteName: string): string {
    return this.getAppRouterSiteRewrite(pathname, siteName);
  }

  private getAppRouterSiteRewrite(pathname: string, siteName: string): string {
    const path = pathname.startsWith('/') ? pathname : '/' + pathname;
    return `/${siteName}${path}`;
  }
}
