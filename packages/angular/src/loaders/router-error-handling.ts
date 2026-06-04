import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';
import type { NavigationError } from '@angular/router';
import { DEFAULT_ERROR_ROUTE, DEFAULT_NOT_FOUND_ROUTE, NotFoundNavigationError } from './models';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN, SITECORE_CONFIG_TOKEN } from '../lib/tokens';
import { splitLocaleFromPath } from '../i18n/locale-utils';

/**
 * Normalizes a URL path (strip leading slash and query) for comparison.
 * @param {string} url - URL or path string
 * @returns Normalized path segment
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
 * @returns RedirectCommand to redirect, or void to cancel and avoid a loop
 * @public
 */
export function redirectOnNavigationError(
  err: Error,
  failedUrl: string,
  notFoundRoute: string,
  errorRoute: string,
  router: Router
): RedirectCommand | void {
  console.log('Navigation error occurred on url: ' + failedUrl, err.message);

  const kind: 'error' | 'notFound' = err instanceof NotFoundNavigationError ? 'notFound' : 'error';

  const failedPath = normalizePath(failedUrl);
  const notFoundPath = normalizePath(notFoundRoute);
  const errorPath = normalizePath(errorRoute);

  if (kind === 'notFound') {
    if (failedPath === notFoundPath) {
      console.log('RouteErrorHandler: Not found route was not found. Avoiding redirect loop.');
      return;
    }
    const urlTree = router.parseUrl(notFoundRoute);
    return new RedirectCommand(urlTree);
  }

  // kind === 'error'
  if (failedPath === errorPath) {
    console.log('RouteErrorHandler: Error route threw its own error. Avoiding redirect loop.');
    return;
  }
  const urlTree = router.parseUrl(errorRoute);
  return new RedirectCommand(urlTree);
}

/**
 * Returns a navigation error handler for use with withNavigationErrorHandler.
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
    const locales = inject(SITECORE_CONFIG_TOKEN, { optional: true })?.angular?.locales ?? [];
    const router = inject(Router);
    const { locale } = splitLocaleFromPath(failedUrl, locales);
    const targetNotFound = locale ? `/${locale}${notFoundRoute}` : notFoundRoute;
    const targetError = locale ? `/${locale}${errorRoute}` : errorRoute;
    return redirectOnNavigationError(err, failedUrl, targetNotFound, targetError, router);
  };
}
