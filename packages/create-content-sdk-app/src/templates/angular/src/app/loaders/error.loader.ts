import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage } from '@sitecore-content-sdk/angular';
import { getClient } from '../lib/sitecore-client';
import { errorPageResult } from './stub-utils';

/**
 * 500 loader. Fetches the configured Server Error page from Sitecore via scClient.
 * Falls back to a local stub when the CMS has no error page configured.
 */
export const errorLoader: LoaderFn<Page> = async (context) => {
  const page = await getClient().getErrorPage(ErrorPage.InternalServerError);
  return page ?? errorPageResult(context.url, 'Internal Server Error');
};
