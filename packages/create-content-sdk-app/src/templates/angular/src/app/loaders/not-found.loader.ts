import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage } from '@sitecore-content-sdk/angular';
import { getClient } from '../lib/sitecore-client';
import { errorPageResult } from './stub-utils';

/**
 * 404 loader. Fetches the configured Not Found error page from Sitecore via scClient.
 * Falls back to a local stub when the CMS has no error page configured.
 */
export const notFoundLoader: LoaderFn<Page> = async (context) => {
  const page = await getClient().getErrorPage(ErrorPage.NotFound);
  return page ?? errorPageResult(context.url, 'Page Not Found');
};
