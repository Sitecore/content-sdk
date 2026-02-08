import { createMultisiteMiddleware, type SiteInfo } from '@sitecore-content-sdk/astro/middleware';
import sitesConfig from '../.sitecore/sites.json';
import config from './sitecore.config';
import { i18n } from 'astro:config/server';

// Cast imported sites to SiteInfo[] for proper typing
const sites = sitesConfig as SiteInfo[];

/**
 * Astro middleware for multisite support.
 * Resolves the site based on hostname, query parameters, or cookies,
 * and rewrites the request path to include the site prefix.
 */
const multisiteMiddleware = createMultisiteMiddleware({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  /**
   * Default site name to use when hostname cannot be matched
   */
  defaultSite: config.defaultSite,
  /**
   * List of locales from Astro i18n config
   */
  locales: (i18n?.locales as string[]) || [config.defaultLanguage],
  /**
   * Determines if the middleware should be skipped for this request
   * Certain paths are ignored by default (e.g., files and API routes)
   * You can add custom skip logic here
   */
  skip: () => false,
  /**
   * Optional: Enable cookie-based site resolution
   * When enabled, the site can be determined from the sc_site cookie
   */
  // useCookieResolution: () => true,
});

export const onRequest = multisiteMiddleware;
