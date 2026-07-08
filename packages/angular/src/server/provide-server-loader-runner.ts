import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  REQUEST_CONTEXT,
} from '@angular/core';
import { LOADER_REGISTRY } from '../loaders/loader-registry.token';
import { SERVER_LOADER_RUNNER } from '../loaders/server-loader-runner.token';
import { LoaderCache, LoaderRunnerInit } from '../loaders/models';
import { ServerLoaderRunner } from './server-loader-runner';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';

/**
 * Wires SSR {@link SERVER_LOADER_RUNNER} to ServerLoaderRunner
 * using the shared {@link LOADER_REGISTRY}. Include in server application providers
 * alongside provideLoaderRegistry.
 * @returns Environment providers for SSR loader data resolution
 * @public
 */
export function provideServerLoaderRunner(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SERVER_LOADER_RUNNER,
      useFactory: () => {
        const registry = inject(LOADER_REGISTRY);
        const config = inject(SITECORE_CONFIG_TOKEN);
        return {
          resolve(request: LoaderRunnerInit) {
            const ssrContext = inject(REQUEST_CONTEXT, { optional: true }) as
              | { cache?: LoaderCache }
              | undefined;
            const cache = ssrContext?.cache;
            return new ServerLoaderRunner(registry, config, cache).resolve(request);
          },
        };
      },
    },
  ]);
}
