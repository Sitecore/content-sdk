import { ErrorPage } from '@sitecore-content-sdk/angular';
import { client } from '../sitecore-client';
import scConfig from '../../sitecore.config';

export const errorPageLoader = (errorPage: ErrorPage) => async () => {
  const page = await client.getErrorPage(errorPage, {
    site: scConfig.defaultSite,
    locale: scConfig.defaultLanguage,
  });
  console.log('errorPageLoader', page);
  console.log('errorPage route', page?.layout.sitecore.route);
  return page;
};
