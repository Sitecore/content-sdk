import type { LoaderFn } from '../models';
import type { Page } from '@sitecore-content-sdk/content/client';
import { notFound } from '../utils';
import { stubPageResult } from './stub-utils';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Used by the route resolver to enable dynamic route rendering.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const page = stubPageResult(context.url);
  if (!page) {
    notFound();
  }
  return page;
};
