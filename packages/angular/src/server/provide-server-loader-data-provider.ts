import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  REQUEST_CONTEXT,
} from '@angular/core';
import { LOADER_REGISTRY } from '../loaders/loader-registry.token';
import { SERVER_LOADER_DATA_PROVIDER } from '../loaders/server-loader-data-provider.token';
import { LoaderCache, LoaderApiRequest } from '../loaders/models';
import { ServerLoaderDataProvider } from './loader-data.provider';

/**
 * Wires SSR {@link SERVER_LOADER_DATA_PROVIDER} to {@link ServerLoaderDataProvider}
 * using the shared {@link LOADER_REGISTRY}. Include in server application providers
 * alongside {@link provideLoaderRegistry}.
 * @returns Environment providers for SSR loader data resolution
 * @public
 */
export function provideServerLoaderDataProvider(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SERVER_LOADER_DATA_PROVIDER,
      useFactory: () => {
        const registry = inject(LOADER_REGISTRY);
        return {
          resolve(request: LoaderApiRequest) {
            const ssrContext = inject(REQUEST_CONTEXT, { optional: true }) as
              | { cache?: LoaderCache }
              | undefined;
            const cache = ssrContext?.cache;
            return new ServerLoaderDataProvider(registry, cache).resolve(request);
          },
        };
      },
    },
  ]);
}
