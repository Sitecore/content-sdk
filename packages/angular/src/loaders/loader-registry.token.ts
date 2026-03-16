import { InjectionToken, Provider } from '@angular/core';
import type { LoaderFn } from './models';
/* eslint-disable-next-line no-unused-vars -- referenced in JSDoc {@link} below */
import { LOADER_DATA_ENDPOINT } from '../server/constants';

/**
 * Optional endpoint path for loader data fetch (e.g. '/_data' or '/api/data').
 * When null or undefined, {@link LOADER_DATA_ENDPOINT} is used.
 * @public
 */
export const FETCH_DATA_ENDPOINT = new InjectionToken<string | null | undefined>(
  'FETCH_DATA_ENDPOINT'
);

export const LOADER_REGISTRY = new InjectionToken<Record<string, LoaderFn>>('LOADER_REGISTRY');

/**
 * Provides the loader registry for DI. Pass the loaders your app uses (e.g. page, '404', '500').
 * The same loader set must be registered on the server in createLoaderDataServiceMiddleware so
 * client-side navigation can fetch route data via the data endpoint.
 * @param {Record<string, LoaderFn>} loaders - Map of loader id to loader function
 * @public
 */
export const provideLoaderRegistry = (loaders: Record<string, LoaderFn>): Provider[] => {
  return [
    {
      provide: LOADER_REGISTRY,
      useValue: { ...loaders },
    },
  ];
};

/**
 * Symbol used to tag resolver functions with their loader ID.
 * This allows the prefetch service to identify loader resolvers in the route tree.
 * @internal
 */
export const LOADER_ID = Symbol('loaderId');
