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
import { LOADER_ID } from './loader-registry.token';
import { ClientLoaderDataService } from './client-loader-data.service';
import { extractRequestContext, applyRedirect } from './utils';
import {
  DEFAULT_ERROR_ROUTE,
  DEFAULT_NOT_FOUND_ROUTE,
  LoaderHttpError,
  NotFoundNavigationError,
  PerRouteLoaderCacheConfig,
} from './models';
import { redirectOnNavigationError } from './router-error-handling';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from '../lib/tokens';
import { SERVER_LOADER_RUNNER } from './server-loader-runner.token';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
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
 * Merges params from all ancestor route segments and defaults `locale` from the resolved
 * Sitecore config when missing. Loaders always see a concrete `params.locale` whether or
 * not the locale matcher captured one from the URL.
 * @param {ActivatedRouteSnapshot} route - The current route snapshot.
 * @param {string} [defaultLanguage] - Default language to fall back to.
 * @returns {Params} Merged params with a guaranteed `locale` when `defaultLanguage` is set.
 */
function buildLoaderParams(route: ActivatedRouteSnapshot, defaultLanguage?: string): Params {
  const merged = route.pathFromRoot.reduce((acc, r) => ({ ...acc, ...r.params }), {} as Params);
  if (!merged.locale && defaultLanguage) {
    merged.locale = defaultLanguage;
  }
  return merged;
}

/**
 * Browser-only: load data from transfer state or ClientLoaderDataService.
 * Injects TransferState, ClientLoaderDataService. Called by the resolver when isPlatformBrowser.
 * @param {object} options - The options for the resolveOnBrowser function
 * @param {ActivatedRouteSnapshot} options.route - The current route snapshot
 * @param {RouterStateSnapshot} options.state - The router state snapshot
 * @param {string} options.loaderId - loader ID to resolve, used for transfer state key and ClientLoaderDataService call
 * @param {Router} options.router - The Angular router instance
 * @param {string} [options.defaultLanguage] - Default language for locale fallback in params
 * @param {LoaderCacheConfig} [options.cacheOptions] - Cache options for the loader
 * @returns {Promise<unknown | RedirectCommand>} The resolved data or redirect command
 */
async function resolveOnBrowser({
  route,
  state,
  loaderId,
  router,
  defaultLanguage,
  cacheOptions,
}: {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
  loaderId: string;
  router: Router;
  defaultLanguage?: string;
  cacheOptions?: PerRouteLoaderCacheConfig;
}): Promise<unknown | RedirectCommand> {
  const transferState = inject(TransferState);
  const browserLoaderData = inject(ClientLoaderDataService);

  const url = state.url;
  const key = stateKey(loaderId, url);

  if (transferState.hasKey(key)) {
    const data = transferState.get(key, null);
    transferState.remove(key);
    return data;
  }

  const allParams = buildLoaderParams(route, defaultLanguage);

  const resp = await browserLoaderData.getData({
    url,
    loaderId,
    params: allParams,
    query: route.queryParams as Record<string, string | string[]>,
    cacheOptions,
  });

  if (resp.kind === 'error') {
    throw new LoaderHttpError(resp.status, resp.message);
  }
  if (resp.kind === 'notFound') {
    throw new NotFoundNavigationError();
  }
  if (resp.kind === 'redirect') {
    return applyRedirect(router, resp.redirect.loaderRedirectTarget);
  }
  return resp.data;
}

/**
 * Create a loader resolver function that resolver loader data with optional cache options on server or browser.
 * @param {LoaderId} loaderId - The loader ID
 * @param {PerRouteLoaderCacheConfig} [cacheOptions] - The cache options
 * @returns {ResolveFn<unknown>} loader resolver function
 */
export const loaderResolver = (
  loaderId: LoaderId,
  cacheOptions?: PerRouteLoaderCacheConfig
): ResolveFn<unknown> => {
  const resolver = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const transferState = inject(TransferState);
    const platformId = inject(PLATFORM_ID);
    const request = inject(REQUEST, { optional: true });
    const notFoundRoute =
      inject(NOT_FOUND_ROUTE_TOKEN, { optional: true }) || DEFAULT_NOT_FOUND_ROUTE;
    const errorRoute = inject(ERROR_ROUTE_TOKEN, { optional: true }) || DEFAULT_ERROR_ROUTE;
    const router = inject(Router);
    const defaultLanguage = inject(SITECORE_CONFIG_TOKEN, { optional: true })?.defaultLanguage;

    const url = state.url;
    const key = stateKey(loaderId, url);

    if (isPlatformBrowser(platformId)) {
      try {
        return await resolveOnBrowser({
          route,
          state,
          loaderId,
          router,
          defaultLanguage,
          cacheOptions,
        });
      } catch (e) {
        // special handling for browser, as navigation error for handleNavigationError is only generated on server
        return redirectOnNavigationError(e as Error, url, notFoundRoute, errorRoute, router);
      }
    }

    const serverLoaderRunner = inject(SERVER_LOADER_RUNNER, { optional: true });
    if (!serverLoaderRunner) {
      throw new Error(
        'SSR loader resolution requires provideServerLoaderRunner() in server application providers'
      );
    }

    const angularRequestContext = request ? extractRequestContext(request) : undefined;

    const result = await serverLoaderRunner.resolve({
      loaderId,
      url,
      params: buildLoaderParams(route, defaultLanguage),
      query: route.queryParams as Record<string, string | string[]>,
      angularRequestContext,
      cacheOptions,
    });

    if (result.kind === 'redirect') {
      return applyRedirect(router, result.redirect.loaderRedirectTarget);
    }

    if (result.kind === 'error') {
      const cause = result.cause;
      if (cause instanceof NotFoundNavigationError) throw cause;
      if (cause instanceof LoaderHttpError) throw cause;
      throw new LoaderHttpError(result.status, result.message);
    }

    transferState.set(key, result.data);
    return result.data;
  };

  resolver[LOADER_ID] = loaderId;

  return resolver;
};
