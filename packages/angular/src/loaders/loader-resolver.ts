import { inject, TransferState, PLATFORM_ID, REQUEST, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params,
  ResolveFn,
  Router,
  RedirectCommand,
} from '@angular/router';
import { LOADER_REGISTRY, LOADER_ID } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { extractRequestContext, applyRedirect } from './utils';
import {
  DEFAULT_ERROR_ROUTE,
  DEFAULT_NOT_FOUND_ROUTE,
  LoaderHttpError,
  NotFoundNavigationError,
  isLoaderRedirectResult,
} from './models';
import { redirectOnNavigationError } from './router-error-handling';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from '../lib/tokens';
import { normalizeCachedLoaderResponse } from './loader-cache.interface';

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

/** Loader ID type. Use string keys that match the keys you pass to provideLoaderRegistry. */
export type LoaderId = keyof LoaderIdMap extends never ? string : keyof LoaderIdMap;

/**
 * Browser-only: load data from transfer state or LoaderDataService.
 * Injects TransferState, LoaderDataService. Called by the resolver when isPlatformBrowser.
 * @param {ActivatedRouteSnapshot} route - The current route snapshot
 * @param {RouterStateSnapshot} state - The router state snapshot
 * @param {string} loaderId - loader ID to resolve, used for transfer state key and LoaderDataService call
 * @param {Router} router - The Angular router instance
 */
async function resolveOnBrowser(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loaderId: string,
  router: Router
): Promise<unknown | RedirectCommand> {
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

  const resp = normalizeCachedLoaderResponse(
    await loaderData.getData({
      url,
      loaderId,
      params: allParams,
      query: route.queryParams as Record<string, string | string[]>,
    })
  );

  if (resp.kind === 'error') {
    throw new LoaderHttpError(resp.status, resp.message);
  }
  if (resp.kind === 'notFound') {
    throw new NotFoundNavigationError();
  }
  if (resp.kind === 'redirect') {
    return applyRedirect(router, resp.data.loaderRedirectTarget);
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
        return await resolveOnBrowser(route, state, loaderId, router);
      } catch (e) {
        // special handling for browser, as navigation error for handleNavigationError is only generated on server
        return redirectOnNavigationError(e as Error, url, notFoundRoute, errorRoute, router);
      }
    } else {
      const loader = registry[loaderId];

      if (!loader) {
        throw new Error(`No loader registered for id "${loaderId}"`);
      }

      const requestContext = request ? extractRequestContext(request) : undefined;

      const result = await loader({
        url,
        params: route.params,
        query: route.queryParams,
        requestContext,
      });

      if (isLoaderRedirectResult(result)) {
        return applyRedirect(router, result.loaderRedirectTarget);
      }

      transferState.set(key, result);
      return result;
    }
  };

  resolver[LOADER_ID] = loaderId;

  return resolver;
};
