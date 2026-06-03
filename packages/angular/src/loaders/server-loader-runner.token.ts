import { InjectionToken } from '@angular/core';
import { LoaderApiRequest, LoaderDataResult } from './models';

/**
 * SSR injection port for cache-aware loader resolution.
 * Implemented by `ServerLoaderRunner` and wired via
 * `provideServerLoaderRunner` (see the `server/express` module).
 * @public
 */
export interface ServerLoaderRunnerPort {
  /**
   * Resolve loader data on the server (cache-aware) using the shared {@link LOADER_REGISTRY}.
   * @param {LoaderApiRequest} request - Loader request payload
   * @returns {Promise<LoaderDataResult>} Resolved loader result
   */
  resolve(request: LoaderApiRequest): Promise<LoaderDataResult>;
}

/**
 * Injection token for SSR loader data resolution.
 * Must be provided via `provideServerLoaderRunner` in server application config.
 * @public
 */
export const SERVER_LOADER_RUNNER = new InjectionToken<ServerLoaderRunnerPort>(
  'SERVER_LOADER_RUNNER'
);
