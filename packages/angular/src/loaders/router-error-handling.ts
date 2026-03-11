import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';
import type { NavigationError } from '@angular/router';
import { DEFAULT_ERROR_ROUTE, DEFAULT_NOT_FOUND_ROUTE, NotFoundNavigationError } from './models';
import { ERROR_ROUTE_TOKEN, NOT_FOUND_ROUTE_TOKEN } from '../lib/tokens';

function normalizePath(url: string): string {
  return url.replace(/^\//, '').split('?')[0];
}

/**
 * Resolves a navigation error to a RedirectCommand or void.
 * Handles loader exceptions (NotFoundNavigationError and other errors) and prevents redirect loops
 * when the failed navigation was already to the not-found route or the error route.
 * Must be called from an injection context (uses NOT_FOUND_ROUTE_TOKEN, ERROR_ROUTE_TOKEN, Router).
 *
 * @param e - The NavigationError from the router
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
  console.log('Navigation error occurred', err);

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
 * Returns a navigation error handler for use with {@link withNavigationErrorHandler}.
 * Delegates to {@link resolveNavigationError}.
 *
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
    return redirectOnNavigationError(err, failedUrl, notFoundRoute, errorRoute, router);
  };
}
