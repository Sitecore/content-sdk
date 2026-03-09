import { InjectionToken, Provider } from '@angular/core';
import type { LoaderFn } from './models';
import { pageLoader } from './default/page.loader';
import { notFoundLoader } from './default/not-found.loader';
import { errorLoader } from './default/error.loader';
import { DEFAULT_DATA_ENDPOINT } from '../server/config';

/**
 * Optional endpoint path for loader data fetch (e.g. '/_data' or '/api/data').
 * When null or undefined, {@link DEFAULT_DATA_ENDPOINT} is used.
 * @public
 */
export const FETCH_DATA_ENDPOINT = new InjectionToken<string | null | undefined>(
  'FETCH_DATA_ENDPOINT'
);

/** Default loaders: single source of truth for registry entries and for the LoaderId type. */
export const DEFAULT_LOADERS = {
  page: pageLoader,
  '404': notFoundLoader,
  '500': errorLoader,
} as const;

/** Loader IDs from the default registry. Extended by LoaderIdMap when you add custom loaders. */
export type DefaultLoaderId = keyof typeof DEFAULT_LOADERS;

export const LOADER_REGISTRY = new InjectionToken<Record<string, LoaderFn>>('LOADER_REGISTRY');

/**
 * Provides the loader registry with default loaders (page, '404', '500').
 * Pass optional overrides to replace or extend defaults. Same token is injectable in package and app.
 */
export const provideLoaderRegistry = (loaders?: Record<string, LoaderFn>): Provider[] => {
  return [
    {
      provide: LOADER_REGISTRY,
      useValue: { ...DEFAULT_LOADERS, ...(loaders ?? {}) },
    },
  ];
};
