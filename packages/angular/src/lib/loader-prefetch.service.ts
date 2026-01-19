import { Injectable, OnDestroy, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ResolveStart, ActivatedRouteSnapshot, Params } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { LoaderPrefetchConfig, LOADER_PREFETCH_CONFIG } from './loader-prefetch.config';
import { LoaderDataService } from './loader-data.service';
import { getLoaderId } from './loader-resolver';

/**
 * Context for a loader prefetch request.
 * @internal
 */
interface PrefetchContext {
  url: string;
  params: Params;
  query: Record<string, string | string[]>;
}

/**
 * Service that listens to router events and triggers parallel prefetching
 * of all loader resolvers in the matched route tree.
 *
 * This service is automatically instantiated when `provideLoaderPrefetch()` is used.
 * It only activates in the browser environment.
 *
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class LoaderPrefetchService implements OnDestroy {
  private subscription?: Subscription;

  constructor(
    private router: Router,
    private loaderData: LoaderDataService,
    @Optional() @Inject(LOADER_PREFETCH_CONFIG) private config: LoaderPrefetchConfig | null,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.subscription = this.router.events
      .pipe(filter((e): e is ResolveStart => e instanceof ResolveStart))
      .subscribe((event) => this.prefetchAll(event.state.root, event.state.url));
  }

  /**
   * Walk the matched route tree and start prefetching all loaders in parallel.
   */
  private prefetchAll(root: ActivatedRouteSnapshot, url: string): void {
    const loaders = this.collectLoaders(root, url);

    // Fire-and-forget: start all prefetches in parallel
    for (const { loaderId, context } of loaders) {
      this.loaderData.prefetch(context.url, loaderId, context.params, context.query);
    }
  }

  /**
   * Recursively collect all loader IDs and their contexts from the route tree.
   */
  private collectLoaders(
    route: ActivatedRouteSnapshot,
    url: string
  ): Array<{ loaderId: string; context: PrefetchContext }> {
    const loaders: Array<{ loaderId: string; context: PrefetchContext }> = [];

    const resolveConfig = route.routeConfig?.resolve;
    if (resolveConfig) {
      // Collect all params from root to this route (same as loaderResolver does)
      const params = route.pathFromRoot.reduce((acc, r) => ({ ...acc, ...r.params }), {} as Params);

      for (const resolver of Object.values(resolveConfig)) {
        const loaderId = getLoaderId(resolver);
        if (loaderId) {
          loaders.push({
            loaderId,
            context: {
              url,
              params,
              query: route.queryParams as Record<string, string | string[]>,
            },
          });
        }
      }
    }

    // Recurse into children
    for (const child of route.children) {
      loaders.push(...this.collectLoaders(child, url));
    }

    return loaders;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
