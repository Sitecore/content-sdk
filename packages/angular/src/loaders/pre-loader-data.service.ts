import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  ActivationStart,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoaderDataService } from './loader-data.service';
import { LoaderDataRequest } from './loader-data.service';
import { LOADER_ID } from './loader-registry.token';

/**
 * Resolver function shape used in route config (minimal for LOADER_ID detection).
 * @internal
 */
interface ResolverWithLoaderId {
  [key: symbol]: string;
}

/**
 * PreLoaderDataService kicks off loader data fetches for all loaders in the current route
 * and its parent routes in parallel, so that when Angular runs resolvers sequentially,
 * resolvers get cache hits or join already-pending requests instead of waiting.
 *
 * Subscribes to the router's ActivationStart event and prefetches for the
 * ActivatedRouteSnapshot when it is the leaf route (browser only). Discovers all loader
 * resolvers on that snapshot and its parents (via LOADER_ID on pathFromRoot), then
 * calls LoaderDataService.prefetch() for each (loaderId, url, params, query). Fetches
 * run in parallel; results are stored in LoaderDataService cache for getData() to consume.
 * @public
 */
@Injectable({
  providedIn: 'root',
})
export class PreLoaderDataService {
  private readonly loaderData = inject(LoaderDataService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is ActivationStart => e instanceof ActivationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        const snapshot = event.snapshot;
        if (!snapshot.children?.length) {
          this.prefetchForRoute(snapshot, this.router.routerState.snapshot);
        }
      });
  }

  /**
   * Prefetch loader data for all loaders in the route tree.
   * Call this at the start of browser resolver execution so all loaders for the route
   * are kicked off in parallel before resolvers run sequentially.
   * No-op on server.
   * @param {ActivatedRouteSnapshot} route - Current route (pathFromRoot gives current and parent routes)
   * @param {RouterStateSnapshot} state - Current router state (use state.url for the navigation URL)
   */
  async prefetchForRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const loaders = this.collectLoaders(route, state);
    for (const loaderData of loaders) {
      this.loaderData.prefetch(loaderData);
    }
  }

  /**
   * Collect LoaderDataRequest for each resolver that has LOADER_ID on the current route
   * and its parent routes (pathFromRoot). Deduplicates by (loaderId, url).
   * @param {ActivatedRouteSnapshot} route - The current route
   * @param {RouterStateSnapshot} state - The router state snapshot, used for url and params
   */
  private collectLoaders(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): LoaderDataRequest[] {
    const loaderDataRequests: LoaderDataRequest[] = [];
    const breadcrump = route.pathFromRoot ?? [];

    for (const route of breadcrump) {
      if (!route) continue;
      const resolveDefinition = route.routeConfig?.resolve;
      if (resolveDefinition) {
        for (const resolver of Object.values(resolveDefinition)) {
          if (
            typeof resolver === 'function' &&
            LOADER_ID in resolver &&
            typeof (resolver as ResolverWithLoaderId)[LOADER_ID] === 'string'
          ) {
            const loaderId = (resolver as ResolverWithLoaderId)[LOADER_ID];
            const url = state.url;
            const params: Params = (route.pathFromRoot ?? []).reduce(
              (acc, r) => ({ ...acc, ...(r?.params ?? {}) }),
              {}
            );
            loaderDataRequests.push({
              loaderId,
              url,
              params,
              query: (route.queryParams ?? {}) as Record<string, string | string[]>,
            });
          }
        }
      }
    }

    return loaderDataRequests;
  }
}
