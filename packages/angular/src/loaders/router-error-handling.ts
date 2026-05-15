import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';
import type { NavigationError } from '@angular/router';
import { DEFAULT_ERROR_ROUTE, DEFAULT_NOT_FOUND_ROUTE, NotFoundNavigationError } from './models';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN, SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import {
  extractLocaleFromUrl,
  prependLocale,
  stripConfiguredRouteLocalePrefix,
  stripLeadingLocaleFromPathKey,
} from '../i18n/locale-url';
import type { SitecoreAngularConfig } from '../config/models';

/**
 * Normalizes a URL path (strip leading slash and query) for comparison.
 * @param {string} url - URL or path string
 * @returns Normalized path segment without leading slash
 */
function normalizePath(url: string): string {
  return url.replace(/^\//, '').split('?')[0];
}

/**
 * Resolves a navigation error to a RedirectCommand or void.
 * Handles loader exceptions (NotFoundNavigationError and other errors) and prevents redirect loops
 * when the failed navigation was already to the not-found route or the error route.
 * Must be called from an injection context (uses NOT_FOUND_ROUTE_TOKEN, ERROR_ROUTE_TOKEN, Router).
 *
 * **HTTP status codes (SSR):** RedirectCommand only triggers navigation to the not-found or error
 * route; it does not set the HTTP response status. To return 404 or 500 when those pages are
 * rendered on the server, configure your app so the server sends the correct status. For example,
 * in `app.routes.server.ts` add ServerRoute entries for your not-found and error paths with
 * `status: 404` and `status: 500` (see Angular "Setting headers and status codes" in the SSR guide).
 * Alternatively, inject `RESPONSE_INIT` in your NotFoundComponent and ErrorComponent and set the
 * status when running on the server.
 * @param {Error} err - The error from the navigation (e.g. NotFoundNavigationError or LoaderHttpError)
 * @param {string} failedUrl - URL that failed to load
 * @param {string} notFoundRoute - Path for the not-found page (e.g. '/404')
 * @param {string} errorRoute - Path for the error page (e.g. '/500')
 * @param {Router} router - Angular Router instance
 * @param {SitecoreAngularConfig | null | undefined} [scConfig] - Sitecore Angular config (optional; avoids `inject()` after async boundaries)
 * @returns RedirectCommand to redirect, or void to cancel and avoid a loop
 * @public
 */
export function redirectOnNavigationError(
  err: Error,
  failedUrl: string,
  notFoundRoute: string,
  errorRoute: string,
  router: Router,
  scConfig?: SitecoreAngularConfig | null
): RedirectCommand | void {
  const defaultLanguage = scConfig?.defaultLanguage ?? 'en';
  const locales = scConfig?.locales?.length ? scConfig.locales : [defaultLanguage];

  const canonNotFound = stripConfiguredRouteLocalePrefix(notFoundRoute, locales);
  const canonError = stripConfiguredRouteLocalePrefix(errorRoute, locales);
  const locale = extractLocaleFromUrl(failedUrl, locales, defaultLanguage);

  const localizedNotFound = prependLocale(canonNotFound, locale, defaultLanguage);
  const localizedError = prependLocale(canonError, locale, defaultLanguage);

  const failedPath = normalizePath(failedUrl);
  const notFoundKey = normalizePath(canonNotFound);
  const errorKey = normalizePath(canonError);
  const failedStem = stripLeadingLocaleFromPathKey(failedPath, locales);

  const kind: 'error' | 'notFound' = err instanceof NotFoundNavigationError ? 'notFound' : 'error';

  if (kind === 'notFound') {
    if (failedStem === notFoundKey) {
      return;
    }
    return new RedirectCommand(router.parseUrl(localizedNotFound));
  }

  if (failedStem === errorKey) {
    return;
  }
  return new RedirectCommand(router.parseUrl(localizedError));
}

/**
 * Returns a navigation error handler for use with {@link withNavigationErrorHandler}.
 * Delegates to {@link redirectOnNavigationError}.
 * @returns A handler compatible with `provideRouter(routes, withNavigationErrorHandler(...))`
 * @public
 */
export function handleNavigationError(): (error: NavigationError) => RedirectCommand | void {
  return (e: NavigationError): RedirectCommand | void => {
    const err = e?.error ?? e;
    const failedUrl = e.url ?? '';
    const notFoundRoute =
      inject(NOT_FOUND_ROUTE_TOKEN, { optional: true }) || DEFAULT_NOT_FOUND_ROUTE;
    const errorRoute = inject(ERROR_ROUTE_TOKEN, { optional: true }) || DEFAULT_ERROR_ROUTE;
    const router = inject(Router);
    const scConfig = inject(SITECORE_CONFIG_TOKEN, { optional: true });
    return redirectOnNavigationError(err, failedUrl, notFoundRoute, errorRoute, router, scConfig);
  };
}
