import { inject, TransferState, PLATFORM_ID, REQUEST, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params,
  ResolveFn,
  Router,
} from '@angular/router';
import { LOADER_REGISTRY, type DefaultLoaderId } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { extractRequestContext, LOADER_ID } from './utils';
import {
  DEFAULT_ERROR_ROUTE,
  DEFAULT_NOT_FOUND_ROUTE,
  LoaderHttpError,
  NotFoundNavigationError,
} from './models';
import { redirectOnNavigationError } from './router-error-handling';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from '../lib/tokens';

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

/**
 * Browser-only: load data from transfer state or LoaderDataService.
 * Injects TransferState, Router, LoaderDataService. Called by the resolver when isPlatformBrowser.
 */
async function resolveOnBrowser(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loaderId: string
): Promise<unknown> {
  const transferState = inject(TransferState);
  const loaderData = inject(LoaderDataService);

  const url = state.url;
  const key = stateKey(loaderId, url);

  if (transferState.hasKey(key)) {
    const data = transferState.get(key, null);
    transferState.remove(key);
    return data;
  }

  const allParams = route.pathFromRoot.reduce((acc, r) => ({ ...acc, ...r.params }), {}) as Params;

  const resp = await loaderData.getData({
    url,
    loaderId,
    params: allParams,
    query: route.queryParams as Record<string, string | string[]>,
  });

  if (resp.kind === 'error') {
    throw new LoaderHttpError(resp.status, resp.message);
  }
  if (resp.kind === 'notFound') {
    throw new NotFoundNavigationError();
  }
  return resp.data;
}

export const loaderResolver = (loaderId: LoaderId): ResolveFn<unknown> => {
  const resolver = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const transferState = inject(TransferState);
    const platformId = inject(PLATFORM_ID);
    const registry = inject(LOADER_REGISTRY);
    const request = inject(REQUEST, { optional: true });
    const notFoundRoute =
      inject(NOT_FOUND_ROUTE_TOKEN, { optional: true }) || DEFAULT_NOT_FOUND_ROUTE;
    const errorRoute = inject(ERROR_ROUTE_TOKEN, { optional: true }) || DEFAULT_ERROR_ROUTE;
    const router = inject(Router);

    const url = state.url;
    const key = stateKey(loaderId, url);

    if (isPlatformBrowser(platformId)) {
      try {
        return await resolveOnBrowser(route, state, loaderId);
      } catch (e) {
        // special handling for browser, as navigation error is only produced on server
        return redirectOnNavigationError(e as Error, url, notFoundRoute, errorRoute, router);
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

  resolver[LOADER_ID] = loaderId;

  return resolver;
};
