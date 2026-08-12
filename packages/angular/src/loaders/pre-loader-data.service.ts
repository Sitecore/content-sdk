import { DestroyRef, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  ActivationStart,
  PRIMARY_OUTLET,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ClientLoaderDataService } from './client-loader-data.service';
import { LoaderPayload } from './models';
import { collectLoaderIds, mergeRouteParams } from './route-loader-utils';
import { matchRouteChain } from './route-matcher';
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
  ): LoaderPayload[] {
    const loaderDataRequests: LoaderPayload[] = [];
    const breadcrumb = route.pathFromRoot ?? [];

    for (const ancestor of breadcrumb) {
      if (!ancestor) continue;
      const loaderIds = collectLoaderIds([ancestor.routeConfig?.resolve]);
      if (loaderIds.length === 0) continue;

      const routeParams = mergeRouteParams((ancestor.pathFromRoot ?? []).map((r) => r?.params ?? {}));
      const query = (ancestor.queryParams ?? {}) as Record<string, string | string[]>;

      for (const loaderId of loaderIds) {
        loaderDataRequests.push({ loaderId, url: state.url, routeParams, query });
      }
    }

    return loaderDataRequests;
  }

  /**
   * Resolves the loaders that would apply to `url` — without navigating — and prefetches each
   * via {@link ClientLoaderDataService.prefetch}. Walks the app's route config
   * (`Router.config`) with {@link matchRouteChain} to find the matched route chain for `url`,
   * merges params across parent + child levels the same way live navigation does, and kicks
   * off one prefetch per `LOADER_ID`-tagged resolver found across that chain.
   *
   * No-ops on server, or when no route matches `url`, or when the matched chain has no loaders.
   * Intended as the entry point for hover/eager link prefetch (see the `scRouterLink`/`scRichText`
   * directives); does not itself gate on an enable/disable flag — callers decide when to invoke it.
   *
   * `url` is author-controlled in practice (a Sitecore link/rich-text field), so parsing is
   * wrapped defensively: `Router.parseUrl` can throw (e.g. `URIError` on malformed
   * percent-encoding like a stray `%`). The eager-mode caller invokes this synchronously,
   * inline, while looping over every link on the page — an unhandled throw for one bad href
   * would abort that loop and leave later links without their click handlers attached, so a
   * bad href here must degrade to a no-op, not propagate.
   * @param {string} url - Candidate navigation URL (e.g. an anchor's `href`).
   * @param {object} [options] - Prefetch options
   * @param {boolean} [options.force] - Forwarded to {@link ClientLoaderDataService.prefetch} — bypass the staged-response check. Hover callers pass `true` (every hover re-asks); eager callers omit it (dedupes permanently once staged).
   */
  prefetchForUrl(url: string, options?: { force?: boolean }): void {
    if (!isPlatformBrowser(this.platformId)) {
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

    // Params are merged per level (root..that level), same as a real navigation would give
    // each resolver its own ActivatedRouteSnapshot.pathFromRoot — a loader on a parent route
    // never sees params contributed only by a deeper child route.
    chain.forEach((level, index) => {
      const loaderIds = collectLoaderIds([level.route.resolve]);
      if (loaderIds.length === 0) {
        return;
      }
      const routeParams = mergeRouteParams(
        chain.slice(0, index + 1).map((c) => c.params),
        this.defaultLanguage
      );
      for (const loaderId of loaderIds) {
        this.loaderData.prefetch({ loaderId, url, routeParams, query }, options);
      }
    });
  }
}
