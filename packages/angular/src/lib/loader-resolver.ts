// src/app/loaders/loader.resolver.ts
import { inject, makeStateKey, TransferState, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  RedirectCommand,
  Params,
} from '@angular/router';
import { LOADER_REGISTRY } from './loader-registry.token';
import { LoaderDataService } from './loader-data.service';

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
 * @param loaderId - The loader ID
 * @param url - The URL
 * @returns The state key
 */
function tsKey(loaderId: string, url: string) {
  return makeStateKey<any>(`loader:${loaderId}:${url}`);
}

export interface LoaderIdMap {}

export type LoaderId = keyof LoaderIdMap extends never ? string : keyof LoaderIdMap;

export const loaderResolver: (loaderId: LoaderId) => ResolveFn<any> = (loaderId: string) => {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // All inject() calls must happen synchronously at the top before any await
    const transferState = inject(TransferState);
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);
    const registry = inject(LOADER_REGISTRY);
    const loaderData = inject(LoaderDataService);

    const url = state.url;
    const key = tsKey(loaderId, url);

    // Browser: use SSR TransferState once, otherwise fetch via LoaderDataService
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

    // Server: execute loader directly (no HTTP hop)
    const loader = registry[loaderId];
    if (!loader) throw new Error(`No loader registered for id "${loaderId}"`);

    try {
      const data = await loader({
        url,
        params: route.params,
        query: route.queryParams,
        // optionally pass Request via DI if you want, see note below
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
};
