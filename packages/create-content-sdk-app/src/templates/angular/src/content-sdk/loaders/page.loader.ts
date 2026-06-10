import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  getEditingPreviewData,
  splitLocaleFromPath,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const previewData = getEditingPreviewData(context.requestContext);
  const locale = (context.params['locale'] as string | undefined) || scConfig.defaultLanguage;
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);
  const site = scConfig.defaultSite;

  const page = previewData
    ? await getClient().getPreview(previewData)
    : await getClient().getPage(nonLocalePath, { locale, site });

  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
