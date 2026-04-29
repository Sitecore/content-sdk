import { InjectionToken } from '@angular/core';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { LoaderResultCacheStore } from '../loaders/loader-cache.interface';

/**
 * Injection token for the Sitecore configuration.
 * Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })`. Inject this to read config app-wide.
 * @public
 */
export const SITECORE_CONFIG_TOKEN = new InjectionToken<SitecoreConfig>('SITECORE_CONFIG_TOKEN');

/**
 * Injection token for the SitecoreClient instance.
 * Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })` with the app-supplied client instance.
 * @public
 */
export const SITECORE_CLIENT_TOKEN = new InjectionToken<SitecoreClient>('SITECORE_CLIENT_TOKEN');

export const NOT_FOUND_ROUTE_TOKEN = new InjectionToken<string>('NOT_FOUND_ROUTE_TOKEN');

/**
 * Injection token for the error route.
 * @public
 */
export const ERROR_ROUTE_TOKEN = new InjectionToken<string>('ERROR_ROUTE_TOKEN');

/**
 * Loader result cache for SSR resolvers. Browser apps receive {@link NullLoaderCache} by default.
 * On the server, provide the real cache (e.g. from `@sitecore-content-sdk/angular/node`) so SSR and Express `/_data` share one instance.
 * @public
 */
export const LOADER_RESULT_CACHE_TOKEN = new InjectionToken<LoaderResultCacheStore>(
  'LOADER_RESULT_CACHE_TOKEN'
);
