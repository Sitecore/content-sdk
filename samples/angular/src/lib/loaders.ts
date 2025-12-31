import { ErrorPage, LoaderFn } from '@sitecore-content-sdk/angular';
import { pageLoader } from './page-loader';
import { errorPageLoader } from './not-found-loader';

export const SERVER_LOADERS = {
  page: pageLoader,
  '404': errorPageLoader(ErrorPage.NotFound),
  '500': errorPageLoader(ErrorPage.InternalServerError),
} as const satisfies Record<string, LoaderFn>;

type ServerLoaderIdMap = typeof SERVER_LOADERS;

declare module '@sitecore-content-sdk/angular' {
  export interface LoaderIdMap extends ServerLoaderIdMap {}
}
