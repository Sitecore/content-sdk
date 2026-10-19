import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage } from '@sitecore-content-sdk/angular';
import { getClient } from '../client/sitecore-client';

/**
 * 404 loader. Fetches the configured Not Found error page from Sitecore via the shared client.
 */
export const notFoundLoader: LoaderFn<Page> = async () => {
  return await getClient().getErrorPage(ErrorPage.NotFound);
};
