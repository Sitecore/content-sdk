import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage, SITECORE_CLIENT_TOKEN } from '@sitecore-content-sdk/angular';
import { inject } from '@angular/core';

/**
 * 500 loader. Fetches the configured Server Error page from Sitecore via scClient.
 */
export const errorLoader: LoaderFn<Page> = async () => {
  const client = inject(SITECORE_CLIENT_TOKEN);
  const page = await client.getErrorPage(ErrorPage.InternalServerError);
  return page;
};
