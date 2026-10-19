import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  REQUEST_CONTEXT,
  RESPONSE_INIT,
} from '@angular/core';
import { LOADER_REGISTRY } from '../loaders/loader-registry.token';
import { SERVER_LOADER_RUNNER } from '../loaders/server-loader-runner.token';
import { LoaderCache, LoaderRunnerInit } from '../loaders/models';
import { ServerLoaderRunner } from './server-loader-runner';
import { readPersonalizeTokens } from '../loaders/context-helpers';
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
            if (readPersonalizeTokens(request.csdkRequestData?.headers)) {
              // The SSR response contains visitor data from dynamic content tokens.
              setNoStore(inject(RESPONSE_INIT, { optional: true }));
            }
            return new ServerLoaderRunner(registry, config, cache).resolve(request);
          },
        };
      },
    },
  ]);
}

/**
 * Marks the SSR response as private and not cacheable.
 * @param {ResponseInit | null} responseInit - Angular SSR response init, when rendering on the server
 */
function setNoStore(responseInit: ResponseInit | null): void {
  if (!responseInit) {
    return;
  }
  if (responseInit.headers instanceof Headers) {
    responseInit.headers.set('Cache-Control', 'private, no-store');
    return;
  }
  const headers = new Headers(responseInit.headers);
  headers.set('Cache-Control', 'private, no-store');
  responseInit.headers = headers;
}
