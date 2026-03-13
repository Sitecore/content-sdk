import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { NotFoundNavigationError } from '@sitecore-content-sdk/angular';
import { stubPageResult } from './stub-utils';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Used by the route resolver to enable dynamic route rendering.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const page = stubPageResult(context.url);
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
