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

/**
 * Cross-boundary loader registry — maps loader IDs to loader functions.
 * The same registry is used for SSR, CSR (`/_data`), and route resolvers.
 * There is no separate server vs client loader set.
 * @public
 */
export type LoaderRegistry = Record<string, LoaderFn>;

export const LOADER_REGISTRY = new InjectionToken<LoaderRegistry>('LOADER_REGISTRY');

/**
 * Registers the app's loader registry for DI. Pass the loaders your app uses
 * (e.g. page, '404', '500'). Use the **same object** with
 * {@link createLoaderDataServiceMiddleware} in `server.ts` so SSR and CSR
 * navigations resolve the same loader functions.
 * @param {LoaderRegistry} loaders - Map of loader id to loader function
 * @public
 */
export const provideLoaderRegistry = (loaders: LoaderRegistry): Provider[] => {
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
