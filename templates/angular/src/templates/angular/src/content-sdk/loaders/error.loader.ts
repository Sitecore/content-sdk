import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage } from '@sitecore-content-sdk/angular';
import { getClient } from '../client/sitecore-client';

/**
 * 500 loader. Fetches the configured Server Error page from Sitecore via the shared client.
 */
export const errorLoader: LoaderFn<Page> = async () => {
  return await getClient().getErrorPage(ErrorPage.InternalServerError);
};
