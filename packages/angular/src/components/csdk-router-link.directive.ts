import { Directive, ElementRef, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, type Route } from '@angular/router';
import type { Params } from '@angular/router';
import { LoaderDataService } from '../loaders/loader-data.service';
import { getLoaderId } from '../loaders/utils';

/**
 * Recursively find a route with path '**' in the route tree.
 */
function findWildcardRoute(routes: Route[]): Route | null {
  for (const route of routes) {
    if (route.path === '**') {
      return route;
    }
    if (route.children?.length) {
      const found = findWildcardRoute(route.children);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Extract loader IDs from a route's resolve map (resolvers created by loaderResolver).
 */
function getLoaderIdsFromRoute(route: Route): string[] {
  const resolve = route.resolve;
  if (!resolve || typeof resolve !== 'object') return [];
  return Object.values(resolve)
    .map((fn) => getLoaderId(fn))
    .filter((id): id is string => id != null);
}

/**
 * Directive that provides RouterLink behavior and prefetches loader data on link hover.
 * Use on the same element as RouterLink (or use standalone; RouterLink is composed via hostDirectives).
 * On hover, loaders from the app's '**' route are prefetched for the link's target URL so navigation is faster.
 *
 * @example
 * ```html
 * <a routerLink="/page" csdkRouterLink>Page</a>
 * ```
 * Or with the directive providing RouterLink:
 * ```html
 * <a csdkRouterLink [routerLink]="'/page'">Page</a>
 * ```
 */
@Directive({
  selector: 'a[csdkRouterLink]',
  standalone: true,
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [
        'routerLink',
        'queryParams',
        'fragment',
        'queryParamsHandling',
        'state',
        'relativeTo',
        'preserveFragment',
      ],
    },
  ],
  host: {
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class CSDKRouterLinkDirective implements OnInit {
  /** Injected Router for route config and URL resolution. */
  private readonly router = inject(Router);
  private readonly loaderDataService = inject(LoaderDataService);
  private readonly elementRef = inject(ElementRef<HTMLAnchorElement>);
  private readonly platformId = inject(PLATFORM_ID);

  /** Cached list of loader IDs from the '**' route. */
  private loaderIds: string[] = [];

  /** Forwarded to host RouterLink via hostDirectives. */
  @Input() routerLink!: unknown[] | string | null;
  @Input() queryParams?: Params | null;
  @Input() fragment?: string | null;
  @Input() queryParamsHandling?: RouterLink['queryParamsHandling'] | null;
  @Input() state?: Record<string, unknown> | null;
  @Input() relativeTo?: Route | null;
  @Input() preserveFragment?: boolean | null;

  ngOnInit(): void {
    this.loaderIds = this.getLoaderIdsFromWildcardRoute();
  }

  onMouseEnter(): void {
    this.prefetchLoadersForLink();
  }

  private getLoaderIdsFromWildcardRoute(): string[] {
    const config = this.router.config;
    const wildcardRoute = findWildcardRoute(config);
    if (!wildcardRoute) return [];
    return getLoaderIdsFromRoute(wildcardRoute);
  }

  private prefetchLoadersForLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.loaderIds.length === 0) return;

    const el = this.elementRef.nativeElement;
    const href = el.getAttribute('href') ?? (el as HTMLAnchorElement).href;
    if (!href) return;

    try {
      const url = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) return;
      const path = url.pathname || '/';
      const query: Record<string, string | string[]> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      const linkUrl = path + (url.search || '');
      const linkTree = this.router.parseUrl(linkUrl);
      const currentTree = this.router.parseUrl(this.router.url);
      if (this.router.serializeUrl(linkTree) === this.router.serializeUrl(currentTree)) return;

      const params: Params = {};
      for (const loaderId of this.loaderIds) {
        this.loaderDataService.prefetch(path, loaderId, params, query);
      }
    } catch {
      // Ignore invalid URLs
    }
  }
}
