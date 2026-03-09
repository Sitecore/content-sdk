import { inject, TransferState, PLATFORM_ID, REQUEST, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Params,
  RedirectCommand,
  ResolveFn,
} from '@angular/router';
import { LOADER_REGISTRY, type DefaultLoaderId } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { extractRequestContext, LOADER_ID, notFound, serverError } from './utils';

/**
 * Create a state key for the loader
 * @param {string} loaderId - The loader ID
 * @param {string} url - The URL
 * @returns {StateKey} The state key
 */
function stateKey(loaderId: string, url: string) {
  return makeStateKey<unknown>(`loader:${loaderId}:${url}`);
}

/**
 * Extension point for custom loader IDs. Augment this interface so that
 * loaderResolver() accepts your loader ids when you add them via provideLoaderRegistry().
 * @example
 * // In your app (e.g. app.d.ts or a types file):
 * declare module '@sitecore-content-sdk/angular' {
 *   interface LoaderIdMap {
 *     myCustomLoader: void;
 *   }
 * }
 * // Then provideLoaderRegistry({ myCustomLoader: myLoader }) and loaderResolver('myCustomLoader') are typed.
 */
export interface LoaderIdMap {}

/** Union of default loader ids and any ids added via LoaderIdMap augmentation. */
export type LoaderId = DefaultLoaderId | keyof LoaderIdMap;

export const loaderResolver = (loaderId: LoaderId): ResolveFn<unknown> => {
  const resolver = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // All inject() calls must happen synchronously at the top before any await
    const transferState = inject(TransferState);
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);
    const registry = inject(LOADER_REGISTRY);
    const loaderData = inject(LoaderDataService);
    // Inject Angular's REQUEST token if available (server-side only)
    const request = inject(REQUEST, { optional: true });

    const url = state.url;
    const key = stateKey(loaderId, url);

    if (!isPlatformServer(platformId)) {
      if (transferState.hasKey(key)) {
        const data = transferState.get(key, null);
        transferState.remove(key);
        return data;
      }

      // Get data from LoaderDataService (handles caching and pending requests)
      const allParams = route.pathFromRoot.reduce(
        (acc, r) => ({ ...acc, ...r.params }),
        {}
      ) as Params;

      const resp = await loaderData.getData({
        url,
        loaderId,
        params: allParams,
        query: route.queryParams as Record<string, string | string[]>,
      });

      if (resp.kind === 'redirect') {
        const urlTree = router.parseUrl(resp.location);
        return new RedirectCommand(urlTree);
      }

      if (resp.kind === 'error') {
        serverError(resp.message);
      } else if (resp.kind === 'notFound') {
        notFound();
      } else {
        return resp.data;
      }
    }

    const loader = registry[loaderId];

    if (!loader) {
      throw new Error(`No loader registered for id "${loaderId}"`);
    }

    const requestContext = request ? extractRequestContext(request) : undefined;

    try {
      const data = await loader({
        url,
        params: route.params,
        query: route.queryParams,
        requestContext,
      });

      transferState.set(key, data);

      return data;
    } catch (e) {
      throw e;
    }
  };

  // Tag the resolver function with its loader ID for prefetch discovery
  resolver[LOADER_ID] = loaderId;

  return resolver;
};
