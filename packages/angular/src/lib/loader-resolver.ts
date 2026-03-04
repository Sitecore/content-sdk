import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, RedirectCommand } from '@angular/router';
import { LOADER_REGISTRY } from './loader-registry.token';

/**
 * Thrown by loaders to trigger a redirect.
 * @public
 */
export class LoaderRedirect extends Error {
  constructor(
    public location: string,
    public status: 301 | 302 | 307 | 308 = 302
  ) {
    super(`Redirect to ${location}`);
  }
}

/**
 * Thrown by loaders when the resource is not found (404).
 * @public
 */
export class LoaderNotFound extends Error {
  constructor(message = 'Not Found') {
    super(message);
  }
}

/**
 * Thrown by loaders for HTTP errors (e.g. 500).
 * @public
 */
export class LoaderHttpError extends Error {
  constructor(public status: number, message = 'Error') {
    super(message);
  }
}

/** Helper to throw {@link LoaderRedirect}. @public */
export function redirect(to: string, status: 301 | 302 | 307 | 308 = 302): never {
  throw new LoaderRedirect(to, status);
}

/** Helper to throw {@link LoaderNotFound}. @public */
export function notFound(): never {
  throw new LoaderNotFound();
}

/** Helper to throw {@link LoaderHttpError}. @public */
export function serverError(message = 'Internal Server Error'): never {
  throw new LoaderHttpError(500, message);
}

/**
 * Symbol used to tag resolver functions with their loader ID (e.g. for prefetch discovery).
 * @internal
 */
export const LOADER_ID = Symbol('loaderId');

/**
 * Extract the loader ID from a resolver function if it was created by loaderResolver.
 * @internal
 */
export function getLoaderId(fn: unknown): string | undefined {
  if (fn && typeof fn === 'function' && LOADER_ID in (fn as object)) {
    return (fn as unknown as Record<symbol, string>)[LOADER_ID];
  }
  return undefined;
}

/**
 * Creates an Angular route resolver that runs the registered loader for the given id.
 * The loader receives url, params, and query from the route and returns data (e.g. Sitecore page).
 * Loaders can throw {@link LoaderNotFound}, {@link LoaderRedirect}, or {@link LoaderHttpError};
 * the app should handle these via router error handling (e.g. redirect to /404 for not found).
 *
 * @param loaderId - Key in the provided {@link LOADER_REGISTRY}
 * @returns A ResolveFn that resolves with the loader result
 * @public
 */
export function loaderResolver(loaderId: string): ResolveFn<unknown> {
  const resolver: ResolveFn<unknown> & { [LOADER_ID]?: string } = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const router = inject(Router);
    const registry = inject(LOADER_REGISTRY);
    const loader = registry[loaderId];

    if (!loader) {
      throw new Error(`No loader registered for id "${loaderId}"`);
    }

    const url = state.url;
    const params = route.pathFromRoot.reduce(
      (acc, r) => ({ ...acc, ...r.params }),
      {} as Record<string, string>
    );
    const query = (route.queryParams ?? {}) as Record<string, string | string[]>;

    try {
      const data = await loader({ url, params, query });
      return data;
    } catch (e) {
      if (e instanceof LoaderRedirect) {
        const urlTree = router.parseUrl(e.location);
        return new RedirectCommand(urlTree, { replaceUrl: true });
      }
      throw e;
    }
  };

  (resolver as unknown as Record<symbol, string>)[LOADER_ID] = loaderId;
  return resolver;
}
