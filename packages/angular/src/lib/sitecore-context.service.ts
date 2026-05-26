import { Injectable, inject, computed, PLATFORM_ID, REQUEST, type Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, type ActivatedRouteSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import type { Page } from '@sitecore-content-sdk/content/client';
import { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import { SITECORE_CONFIG_TOKEN } from './tokens';
import { splitLocaleFromPath, resolveCurrentPath } from '../i18n/locale-utils';
/** Merged keys from route resolve data (same keys apps use today). */
interface SitecoreRouteData {
  page?: Page | null;
  dictionary?: DictionaryPhrases | null;
}
/**
 * Walk the activated route tree and merge `data` from every snapshot node.
 * @param {Router} router - Angular Router instance
 * @returns {SitecoreRouteData} Merged route data
 */
function getMergedRouteData(router: Router): SitecoreRouteData {
  const merged: SitecoreRouteData = {};
  const stack: ActivatedRouteSnapshot[] = [router.routerState.snapshot.root];
  while (stack.length > 0) {
    const route = stack.pop()!;
    Object.assign(merged, route.data);
    stack.push(...route.children);
  }
  return merged;
}
/**
 * Request-scoped Sitecore context derived reactively from the Angular Router.
 *
 * - `page` / `dictionary` — from route resolve data (`loaderResolver('page'|'dictionary')`)
 * - `urlLocale` — from current pathname (SSR REQUEST / window.location, then NavigationEnd)
 * - `isEditing` / `effectiveLocale` — computed from page + urlLocale + config
 *
 * No manual `setPage` / `setDictionary` / `setLocale` wiring required in app components.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreContextService {
  /** Current Sitecore page data (layout + mode). */
  readonly page: Signal<Page | null> = computed(() => this.routeData()?.page ?? null);
  /** Current Sitecore dictionary data. */
  readonly dictionary: Signal<DictionaryPhrases | null> = computed(
    () => this.routeData()?.dictionary ?? null
  );
  /** Whether the current page is in editing mode. */
  readonly isEditing: Signal<boolean> = computed(() => this.page()?.mode?.isEditing ?? false);
  /**
   * Locale extracted from the current URL; `null` when no configured-locale prefix
   * or when locales are not configured.
   */
  readonly urlLocale: Signal<string | null> = computed(() => {
    if (this.locales.length === 0) {
      return null;
    }
    return splitLocaleFromPath(this.pathname(), this.locales).locale;
  });
  /**
   * Effective locale for data fetching: `page.locale ?? urlLocale ?? defaultLanguage`.
   */
  readonly effectiveLocale: Signal<string> = computed(
    () => this.page()?.locale ?? this.urlLocale() ?? this.defaultLanguage
  );
  private readonly router = inject(Router);
  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly req = inject(REQUEST, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly locales = this.config?.angular?.locales ?? [];
  private readonly defaultLanguage = this.config?.defaultLanguage ?? 'en';
  /** Merged resolve data; updates on every completed navigation. */
  private readonly routeData = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => getMergedRouteData(this.router)),
      startWith(getMergedRouteData(this.router))
    ),
    { initialValue: getMergedRouteData(this.router) }
  );
  /**
   * Current pathname without query string.
   * SSR/bootstrap: REQUEST or window.location; client: NavigationEnd.urlAfterRedirects.
   */
  private readonly pathname = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0]),
      startWith(resolveCurrentPath(this.req ?? null, this.isBrowser))
    ),
    { initialValue: resolveCurrentPath(this.req ?? null, this.isBrowser) }
  );
}
