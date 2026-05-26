import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import {
  NotFoundNavigationError,
  splitLocaleFromPath,
  resolveSitecorePage,
} from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const locale = context.params['locale'] as string | undefined;
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);
  const page = await resolveSitecorePage(nonLocalePath, scConfig, getClient(), { locale });
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
