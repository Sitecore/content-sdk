import { cache } from 'react';

/**
 * Represents the page information, including locale and site.
 * @public
 */
export type CachedPageInfo = {
  /**
   * The locale of the current page.
   */
  locale: string;
  /**
   * The site associated with the current page.
   */
  site: string;
};

/**
 * Internal cache implementation for storing page information.
 *
 * This cache is used to store the locale and site information for the current page.
 *
 * It helps avoid the usage of functions that disable SSG such as `headers()`.
 * @internal
 */
const cacheImpl = cache(() => ({ locale: '', site: '' }));

/**
 * Gets the cached page information, including locale and site.
 * @returns An object containing the locale and site information for the current page.
 * @public
 */
export const getCachedPageParams = () => cacheImpl();

/**
 * Sets the cached page information, including locale and site.
 * @param {CachedPageInfo} pageInfo An object containing the locale and site information to be set for the current page cache.
 * @public
 */
export function setCachedPageParams(pageInfo: CachedPageInfo) {
  cacheImpl().locale = pageInfo.locale;
  cacheImpl().site = pageInfo.site;
}

