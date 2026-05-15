import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage, resolveLocale } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * 500 loader. Fetches the configured Server Error page from Sitecore via the shared client.
 */
export const errorLoader: LoaderFn<Page> = async (context) => {
  const locale = resolveLocale(context.params, scConfig.defaultLanguage ?? 'en');
  return await getClient().getErrorPage(ErrorPage.InternalServerError, { locale });
};
