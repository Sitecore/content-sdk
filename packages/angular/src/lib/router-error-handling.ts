import { inject } from '@angular/core';
import { Router, RedirectCommand } from '@angular/router';
import { LoaderRedirect, LoaderNotFound, LoaderHttpError } from './loader-resolver';

/**
 * Options for navigation error handling (e.g. which routes to use for 404/500).
 * @public
 */
export interface NavigationErrorOptions {
  /** Route path for not found (404). Defaults to '/404'. */
  notFoundRoute?: string;
  /** Route path for internal server error (500). Defaults to '/500'. */
  internalServerErrorRoute?: string;
}

/**
 * Returns a function that can be used as Angular's router navigation error handler.
 * Handles {@link LoaderRedirect}, {@link LoaderNotFound}, and {@link LoaderHttpError} by
 * redirecting to the configured not-found or error route, or following redirects.
 *
 * @param options - Routes for 404 and 500
 * @returns Error handler for use with provideRouter(..., withNavigationErrorHandler(...))
 * @public
 */
export function handleNavigationError(options: NavigationErrorOptions = {}) {
  const notFoundRoute = options.notFoundRoute ?? '/404';
  const internalServerErrorRoute = options.internalServerErrorRoute ?? '/500';

  return (e: unknown): RedirectCommand | void => {
    const router = inject(Router);
    const err = e && typeof e === 'object' && 'error' in e ? (e as { error: unknown }).error : e;

    if (err instanceof LoaderRedirect) {
      const isExternal = /^https?:\/\//i.test(err.location);
      if (!isExternal) {
        return new RedirectCommand(router.parseUrl(err.location), { replaceUrl: true });
      }
      window.location.assign(err.location);
      return;
    }

    if (err instanceof LoaderNotFound) {
      return new RedirectCommand(router.parseUrl(notFoundRoute), { skipLocationChange: true });
    }

    if (err instanceof LoaderHttpError || err instanceof Error) {
      return new RedirectCommand(router.parseUrl(internalServerErrorRoute), {
        skipLocationChange: true,
      });
    }

    return new RedirectCommand(router.parseUrl(internalServerErrorRoute), {
      skipLocationChange: true,
    });
  };
}
