import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  getEditingPreviewData,
  getSiteName,
  getVariantId,
  getComponentVariantIds,
  getLanguage,
  splitLocaleFromPath,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const previewData = getEditingPreviewData(context.csdkRequestData);
  const locale = getLanguage(context) || scConfig.defaultLanguage;
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);

  const page = previewData
    ? await getClient().getPreview(previewData)
    : await getClient().getPage(nonLocalePath, {
        locale,
        site: getSiteName(context),
        personalize: {
          variantId: getVariantId(context),
          componentVariantIds: getComponentVariantIds(context),
        },
      });

  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
