import { inject, TransferState, PLATFORM_ID, REQUEST, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Params,
  RedirectCommand,
} from '@angular/router';
import { LOADER_REGISTRY } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';
import { extractRequestContext } from './utils';

export class LoaderRedirect extends Error {
  constructor(public location: string, public status: 301 | 302 | 307 | 308 = 302) {
    super(`Redirect to ${location}`);
  }
}

export class LoaderNotFound extends Error {
  constructor(message = 'Not Found') {
    super(message);
  }
}

export class LoaderHttpError extends Error {
  constructor(public status: number, message = 'Error') {
    super(message);
  }
}

// helpers
export const redirect = (to: string, status: 301 | 302 | 307 | 308 = 302) => {
  throw new LoaderRedirect(to, status);
};
export const notFound = () => {
  throw new LoaderNotFound();
};
export const serverError = (message = 'Internal Server Error') => {
  throw new LoaderHttpError(500, message);
};

/**
 * Create a state key for the loader
 * @param {string} loaderId - The loader ID
 * @param {string} url - The URL
 * @returns {StateKey} The state key
 */
function stateKey(loaderId: string, url: string) {
  return makeStateKey<unknown>(`loader:${loaderId}:${url}`);
}

interface LoaderIdMap {}

type LoaderId = keyof LoaderIdMap extends never ? never : keyof LoaderIdMap;

/**
 * Symbol used to tag resolver functions with their loader ID.
 * This allows the prefetch service to identify loader resolvers in the route tree.
 * @internal
 */
export const LOADER_ID = Symbol('loaderId');

/**
 * Extract the loader ID from a resolver function if it was created by loaderResolver.
 * @param {Function}fn - The resolver function to check
 * @returns {string | undefined} The loader ID if found, undefined otherwise
 * @internal
 */
export const getLoaderId = (fn: unknown): string | undefined => {
  if (fn && typeof fn === 'function' && LOADER_ID in fn) {
    return (fn as Record<symbol, string>)[LOADER_ID];
  }

  return undefined;
};

export const loaderResolver = (loaderId: LoaderId) => {
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
      if (e instanceof LoaderRedirect) {
        const urlTree = router.parseUrl(e.location);
        return new RedirectCommand(urlTree);
      }
      throw e;
    }
  };

  // Tag the resolver function with its loader ID for prefetch discovery
  resolver[LOADER_ID] = loaderId;

  return resolver;
};
