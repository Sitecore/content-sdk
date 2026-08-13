import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  ActivationStart,
  Params,
  PRIMARY_OUTLET,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ClientLoaderDataService } from './client-loader-data.service';
import { collectLoaderIds, mergeRouteParams } from './route-loader-utils';
import { isAbsoluteUrl, matchRouteChain } from './route-matcher';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';

/**
 * ClientPreLoaderDataService kicks off loader data fetches for all loaders in the current route
 * and its parent routes in parallel, so that when Angular runs resolvers sequentially,
 * resolvers get staged prefetched responses or join already-pending requests instead of waiting.
 *
 * Subscribes to the router's ActivationStart event and prefetches for the
 * ActivatedRouteSnapshot when it is the leaf route (browser only). Discovers all loader
 * resolvers on that snapshot and its parents (via LOADER_ID on pathFromRoot), then
 * calls ClientLoaderDataService.prefetch() for each (loaderId, url, params, query). Fetches
 * run in parallel; results are stored in ClientLoaderDataService prefetchedResponses for getData() to consume.
 * @public
 */
@Injectable({
  providedIn: 'root',
})
export class ClientPreLoaderDataService {
  private readonly loaderData = inject(ClientLoaderDataService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly defaultLanguage = inject(SITECORE_CONFIG_TOKEN, { optional: true })
    ?.defaultLanguage;

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
    const levels = (route.pathFromRoot ?? [])
      .filter((ancestor): ancestor is ActivatedRouteSnapshot => !!ancestor)
      .map((ancestor) => ({ resolve: ancestor.routeConfig?.resolve, params: ancestor.params ?? {} }));
    // queryParams are global to the URL (identical across every snapshot level), so the leaf's
    // are representative of the whole chain.
    this.prefetchChain(
      levels,
      state.url,
      (route.queryParams ?? {}) as Record<string, string | string[]>
    );
  }

  /**
   * Shared by {@link prefetchForRoute} and {@link prefetchForUrl}: prefetches every
   * `LOADER_ID`-tagged resolver across an ordered (root → leaf) list of matched route levels.
   * Params are merged per level, so a parent-route loader never sees a child's params.
   * @param {{ resolve: Route['resolve']; params: Params }[]} levels - Matched route levels, root to leaf.
   * @param {string} url - Navigation URL forwarded to each prefetch payload.
   * @param {Record<string, string | string[]>} query - Query params forwarded to each prefetch payload.
   * @param {object} [options] - Prefetch options
   * @param {boolean} [options.force] - Forwarded to {@link ClientLoaderDataService.prefetch}.
   */
  private prefetchChain(
    levels: { resolve: Route['resolve']; params: Params }[],
    url: string,
    query: Record<string, string | string[]>,
    options?: { force?: boolean }
  ): void {
    levels.forEach((level, index) => {
      const loaderIds = collectLoaderIds([level.resolve]);
      if (loaderIds.length === 0) {
        return;
      }
      const routeParams = mergeRouteParams(
        levels.slice(0, index + 1).map((l) => l.params),
        this.defaultLanguage
      );
      for (const loaderId of loaderIds) {
        this.loaderData.prefetch({ loaderId, url, routeParams, query }, options);
      }
    });
  }

  /**
   * Resolves the loaders that apply to `url` - without navigating - via {@link matchRouteChain}
   * against `Router.config`, then prefetches each one, same as {@link prefetchForRoute} does
   * for a live navigation. Entry point for hover/eager link prefetch; doesn't gate on an enable/disable flag itself - callers decide when to call it.
   *
   * No-ops on server, for absolute/external URLs, when `url` matches no route, or when the
   * matched chain has no loaders.
   * @param {string} url - Candidate navigation URL (e.g. an anchor's `href`).
   * @param {object} [options] - Prefetch options
   * @param {boolean} [options.force] - Forwarded to {@link ClientLoaderDataService.prefetch}; hover callers pass `true`, eager callers omit it.
   */
  prefetchForUrl(url: string, options?: { force?: boolean }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Absolute/external URLs (external site, mailto:, tel:, protocol-relative, …) never map to an
    // in-app route — skip before parsing so a scheme like `mailto:` isn't mis-parsed as a path.
    if (isAbsoluteUrl(url)) {
      return;
    }

    let chain: ReturnType<typeof matchRouteChain>;
    let query: Record<string, string | string[]>;
    try {
      const tree = this.router.parseUrl(url);
      const segments = tree.root.children[PRIMARY_OUTLET]?.segments ?? [];
      chain = matchRouteChain(this.router.config, segments);
      query = tree.queryParams as Record<string, string | string[]>;
    } catch {
      // Malformed href (e.g. invalid percent-encoding) — not this feature's job to surface.
      return;
    }
    if (!chain) {
      return;
    }

    this.prefetchChain(
      chain.map((level) => ({ resolve: level.route.resolve, params: level.params })),
      url,
      query,
      options
    );
  }
}
