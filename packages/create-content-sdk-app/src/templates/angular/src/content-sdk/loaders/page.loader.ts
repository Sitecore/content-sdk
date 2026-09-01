import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  getEditingPreviewData,
  getPreviewAuthToken,
  resolvePreviewPage,
  resolvePreviewNavigation,
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

  // Editing render: fetch preview / Design Library layout with the forwarded token.
  if (previewData) {
    return resolvePreviewPage(getClient(), previewData, context.csdkRequestData);
  }

  // Follow-up preview navigation: the preview token cookie is present but there is
  // no editing header, so fetch via getPage with the preview headers.
  if (getPreviewAuthToken(context.csdkRequestData)) {
    return resolvePreviewNavigation(
      getClient(),
      nonLocalePath,
      { site: getSiteName(context), locale },
      context.csdkRequestData
    );
  }

  const page = await getClient().getPage(nonLocalePath, {
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
