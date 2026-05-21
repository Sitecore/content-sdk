import {
  inject,
  provideAppInitializer,
  PLATFORM_ID,
  REQUEST,
  type EnvironmentProviders,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { SitecoreContextService } from '../lib/sitecore-context.service';
import { SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { extractLocaleFromPath } from './locale-utils';

/**
 * Resolves the initial URL pathname from the current execution environment.
 * Returns `'/'` when neither REQUEST nor `window.location` is available.
 * @param {Request | null} req - SSR REQUEST token value, when present.
 * @param {boolean} isBrowser - Whether the current platform is the browser.
 * @returns {string} URL pathname suitable for locale extraction.
 */
function resolveInitialPath(req: Request | null, isBrowser: boolean): string {
  if (req) {
    try {
      return new URL(req.url).pathname;
    } catch {
      // fall through to browser/default
    }
  }
  if (isBrowser && typeof window !== 'undefined' && window.location) {
    return window.location.pathname;
  }
  return '/';
}

/**
 * Provides an APP_INITIALIZER that bootstraps the locale state in {@link SitecoreContextService}.
 *
 * - On bootstrap, reads the initial URL once (SSR `REQUEST` or `window.location`) and updates
 *   the context with the locale extracted from the path.
 * - Subscribes to `Router.events` for subsequent navigations and re-extracts the locale from
 *   `NavigationEnd.urlAfterRedirects`.
 *
 * Should be added by `provideSitecoreAngular` only when locales are configured.
 * @returns {EnvironmentProviders} Environment providers wiring the locale bootstrap.
 * @public
 */
export function provideLocaleBootstrap(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const context = inject(SitecoreContextService);
    const config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
    const locales = config?.angular?.locales ?? [];
    if (locales.length === 0) {
      return;
    }

    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);
    const req = inject(REQUEST, { optional: true });
    const router = inject(Router);

    const initialPath = resolveInitialPath(req, isBrowser);
    context.setLocale(extractLocaleFromPath(initialPath, locales).locale);

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects.split('?')[0];
        context.setLocale(extractLocaleFromPath(path, locales).locale);
      }
    });
  });
}
