import { cache } from 'react';

/**
 * Represents the page params, including locale and site.
 * @public
 */
export type CachedPageParams = {
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
 * Internal cache implementation for storing page params.
 *
 * This cache is used to store the locale and site information for the current page.
 *
 * It helps avoid the usage of functions that disable SSG such as `headers()`.
 * @internal
 */
const cacheImpl = cache(() => ({ locale: '', site: '' }));

/**
 * Gets the cached page params, including locale and site.
 * @returns An object containing the locale and site information for the current page.
 * @public
 */
export const getCachedPageParams = () => cacheImpl();

/**
 * Sets the cached page params, including locale and site.
 * @param {CachedPageParams} pageParams An object containing the locale and site information to be set for the current page cache.
 * @public
 */
export function setCachedPageParams(pageParams: CachedPageParams) {
  cacheImpl().locale = pageParams.locale;
  cacheImpl().site = pageParams.site;
}

