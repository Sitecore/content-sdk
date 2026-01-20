import { ErrorPage, LoaderFn } from '@sitecore-content-sdk/angular';
import { pageLoader } from './page-loader';
import { errorPageLoader } from './not-found-loader';
import { dictionaryLoader } from './dictionary-loader';

export const SERVER_LOADERS = {
  dictionary: dictionaryLoader,
  page: pageLoader,
  '404': errorPageLoader(ErrorPage.NotFound),
  '500': errorPageLoader(ErrorPage.InternalServerError),
} as const satisfies Record<string, LoaderFn>;

type ServerLoaderIdMap = typeof SERVER_LOADERS;

declare module '@sitecore-content-sdk/angular' {
  export interface LoaderIdMap extends ServerLoaderIdMap {}
}
