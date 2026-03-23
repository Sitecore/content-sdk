import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { NotFoundNavigationError, resolvePage } from '@sitecore-content-sdk/angular';
import { getClient } from '../lib/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses resolvePage() with the lazily-initialized SitecoreClient.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const page = await resolvePage(getClient(), context.url);
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
