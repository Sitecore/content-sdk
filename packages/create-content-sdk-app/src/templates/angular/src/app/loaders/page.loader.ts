import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { NotFoundNavigationError, SitecorePageResolver } from '@sitecore-content-sdk/angular';
import { inject } from '@angular/core';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses {@link SitecorePageResolver#resolvePage} (`providedIn: 'root'`), injectable in loaders.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const resolver = inject(SitecorePageResolver);
  const page = await resolver.resolvePage(context.url);
  if (!page) {
    throw new NotFoundNavigationError();
  }
  return page;
};
