import { getAppRouterSiteRewrite } from '@sitecore-content-sdk/core/site';
import { MultisiteMiddleware } from './multisite-middleware';

export class AppRouterMultisiteMiddleware extends MultisiteMiddleware {
  /**
   * Generates a site-specific rewrite path for app router based on the provided pathname and site name.
   * @param {string} pathname - The pathname to be rewritten.
   * @param {string} siteName - The name of the site.
   * @returns The rewritten path as a string.
   */
  protected getSiteRewrite(pathname: string, siteName: string): string {
    return getAppRouterSiteRewrite(pathname, {
      siteName,
    });
  }
}
