import { InjectionToken } from '@angular/core';
import { LoaderApiRequest, LoaderDataResult } from './models';

/**
 * SSR injection port for cache-aware loader resolution.
 * Implemented by {@link ServerLoaderDataProvider} and wired via
 * {@link provideServerLoaderDataProvider}.
 * @public
 */
export interface ServerLoaderDataProviderPort {
  /**
   * Resolve loader data on the server (cache-aware) using the shared {@link LOADER_REGISTRY}.
   * @param {LoaderApiRequest} request - Loader request payload
   * @returns {Promise<LoaderDataResult>} Resolved loader result
   */
  resolve(request: LoaderApiRequest): Promise<LoaderDataResult>;
}

/**
 * Injection token for SSR loader data resolution.
 * Must be provided via `provideServerLoaderDataProvider()` in server application config.
 * @public
 */
export const SERVER_LOADER_DATA_PROVIDER = new InjectionToken<ServerLoaderDataProviderPort>(
  'SERVER_LOADER_DATA_PROVIDER'
);
