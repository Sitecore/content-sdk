import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { ErrorPage, SITECORE_CLIENT_TOKEN } from '@sitecore-content-sdk/angular';
import { inject } from '@angular/core';

/**
 * 404 loader. Fetches the configured Not Found error page from Sitecore via scClient.
 */
export const notFoundLoader: LoaderFn<Page> = async () => {
  const client = inject(SITECORE_CLIENT_TOKEN);
  const page = await client.getErrorPage(ErrorPage.NotFound);
  return page;
};
