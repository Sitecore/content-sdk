import { inject } from '@angular/core';
import { Router, RedirectCommand } from '@angular/router';
import type { NavigationError } from '@angular/router';
import { debug } from '@sitecore-content-sdk/core';
import { LoaderRedirect, NotFoundNavigationError } from './models';

/**
 * Options for navigation error handling.
 * Used to configure which routes to redirect to for 404 and 500 errors.
 * @public
 */
export interface NavigationErrorOptions {
  /** Route path for not found (404). Defaults to '/404'. */
  notFoundRoute?: string;
  /** Route path for internal server error (500). Defaults to '/500'. */
  internalServerErrorRoute?: string;
}

/**
 * Returns a navigation error handler for use with {@link withNavigationErrorHandler}.
 * Handles loader exceptions so that:
 * - {@link LoaderNotFound} → redirect to the not-found route (e.g. /404), keeping the failed URL in the address bar
 * - If the failed navigation was already to the error route (e.g. /500 loader threw), returns void to cancel navigation and avoid a loop
 * - {@link LoaderRedirect} → redirect to the target location (or perform external redirect in browser)
 *
 * @param options - Routes for 404 and 500
 * @returns A handler compatible with `provideRouter(routes, withNavigationErrorHandler(...))`
 * @public
 */
export function handleNavigationError(
  options: NavigationErrorOptions = {}
): (error: NavigationError) => RedirectCommand | void {
  const notFoundRoute = options.notFoundRoute ?? '/404';
  const internalServerErrorRoute = options.internalServerErrorRoute ?? '/500';

  return (e: NavigationError): RedirectCommand | void => {
    const router = inject(Router);
    const err = e?.error ?? e;
    debug.common('Navigation error occurred', err);

    if (err instanceof NotFoundNavigationError) {
      return new RedirectCommand(router.parseUrl(notFoundRoute), { skipLocationChange: true });
    }

    // If the failed navigation was already to the error route (e.g. /500 loader threw),
    // do not redirect again — cancel navigation so we don't loop.
    const failedPath = (e.url ?? '').replace(/^\//, '').split('?')[0];
    const errorPath = internalServerErrorRoute.replace(/^\//, '');
    if (failedPath === errorPath) {
      debug.common('RouteErrorHandler: Error route threw its own error. Avoiding redirect loop.');
      debug.common('Error:', e);
      return;
    }

    return new RedirectCommand(router.parseUrl(internalServerErrorRoute), {
      skipLocationChange: true,
    });
  };
}
