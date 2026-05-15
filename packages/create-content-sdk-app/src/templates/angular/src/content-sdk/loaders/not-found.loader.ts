import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage, resolveLocale } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * 404 loader. Fetches the configured Not Found error page from Sitecore via the shared client.
 */
export const notFoundLoader: LoaderFn<Page> = async (context) => {
  const locale = resolveLocale(context.params, scConfig.defaultLanguage ?? 'en');
  return await getClient().getErrorPage(ErrorPage.NotFound, { locale });
};
