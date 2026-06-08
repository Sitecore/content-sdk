import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  getEditingPreviewData,
  resolveSitecorePage,
  splitLocaleFromPath,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 *
 * When the request flows through the editing-render middleware, the request context
 * carries an editing preview payload; we forward it to {@link resolveSitecorePage}
 * so the client calls `getPreview` instead of `getPage`.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const previewData = getEditingPreviewData(context.requestContext);
  const locale = previewData ? previewData.language : (context.params['locale'] as string | undefined);
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);
  const page = await resolveSitecorePage(nonLocalePath, scConfig, getClient(), {
    locale,
    previewData,
  });
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
