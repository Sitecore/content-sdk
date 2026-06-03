import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  REQUEST_CONTEXT,
} from '@angular/core';
import { LOADER_REGISTRY } from '../loaders/loader-registry.token';
import { SERVER_LOADER_RUNNER } from '../loaders/server-loader-runner.token';
import { LoaderCache, LoaderApiRequest } from '../loaders/models';
import { ServerLoaderRunner } from './server-loader-runner';

/**
 * Wires SSR {@link SERVER_LOADER_DATA_PROVIDER} to {@link ServerLoaderRunner}
 * using the shared {@link LOADER_REGISTRY}. Include in server application providers
 * alongside {@link provideLoaderRegistry}.
 * @returns Environment providers for SSR loader data resolution
 * @public
 */
export function provideServerLoaderRunner(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SERVER_LOADER_RUNNER,
      useFactory: () => {
        const registry = inject(LOADER_REGISTRY);
        return {
          resolve(request: LoaderApiRequest) {
            const ssrContext = inject(REQUEST_CONTEXT, { optional: true }) as
              | { cache?: LoaderCache }
              | undefined;
            const cache = ssrContext?.cache;
            return new ServerLoaderRunner(registry, cache).resolve(request);
          },
        };
      },
    },
  ]);
}
