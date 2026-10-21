import { InjectionToken } from '@angular/core';
import { LoaderRunnerInit, LoaderDataResult } from './models';

/**
 * SSR injection port for cache-aware loader resolution.
 * Implemented by `ServerLoaderRunner` and wired via
 * `provideServerLoaderRunner` (see the `server/express` module).
 * @public
 */
export interface ServerLoaderRunnerPort {
  /**
   * Resolve loader data on the server (cache-aware) using the shared {@link LOADER_REGISTRY}.
   * @param {LoaderRunnerInit} init - Loader request payload
   * @returns {Promise<LoaderDataResult>} Resolved loader result
   */
  resolve(init: LoaderRunnerInit): Promise<LoaderDataResult>;
}

/**
 * Injection token for SSR loader data resolution.
 * Must be provided via `provideServerLoaderRunner` in server application config.
 * @public
 */
export const SERVER_LOADER_RUNNER = new InjectionToken<ServerLoaderRunnerPort>(
  'SERVER_LOADER_RUNNER'
);
