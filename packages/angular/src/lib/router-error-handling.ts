import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router, RedirectCommand } from '@angular/router';
import { RESPONSE_INIT } from '@angular/core';
import { LoaderRedirect, LoaderNotFound, LoaderHttpError } from './loader-resolver';

function setSsrStatus(status: number, location?: string) {
  const responseInit = inject(RESPONSE_INIT, { optional: true }) as ResponseInit | null;
  if (!responseInit) return;

  responseInit.status = status;

  if (location) {
    const headers =
      responseInit.headers instanceof Headers
        ? responseInit.headers
        : new Headers(responseInit.headers);
    headers.set('Location', location);
    responseInit.headers = headers;
  }
}

export interface NavigationErrorOptions {
  notFoundRoute: string;
  internalServerErrorRoute: string;
}

export function handleNavigationError(options: NavigationErrorOptions) {
  return (e: any) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const isServer = isPlatformServer(platformId);

    const err = e?.error ?? e;

    // 1) Redirect
    if (err instanceof LoaderRedirect) {
      if (isServer) setSsrStatus(err.status, err.location);

      // Internal vs external
      const isExternal = /^https?:\/\//i.test(err.location);
      if (!isExternal) {
        return new RedirectCommand(router.parseUrl(err.location), { replaceUrl: true });
      }

      // External redirect: on the browser, do a hard navigation
      if (!isServer) window.location.assign(err.location);

      return; // SSR already got Location + status
    }

    // 2) NotFound -> render 404 page but KEEP the original URL
    if (err instanceof LoaderNotFound) {
      if (isServer) setSsrStatus(404);

      return new RedirectCommand(router.parseUrl(options.notFoundRoute ?? '/404'), {
        skipLocationChange: true, // keeps original URL in the address bar
      });
    }

    // 3) 500 (and other errors)
    const status = err instanceof LoaderHttpError ? err.status : 500;
    if (isServer) setSsrStatus(status);

    return new RedirectCommand(router.parseUrl(options.internalServerErrorRoute ?? '/500'), {
      skipLocationChange: true,
    });
  };
}
