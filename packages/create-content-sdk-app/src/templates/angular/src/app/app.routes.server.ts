import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server route config. Defines `404` and `500` (both unprefixed and locale-prefixed
 * via a `:locale` parameter segment) so the server responds with the correct HTTP
 * status code when the loader resolver redirects to an error route (e.g. after
 * `NotFoundNavigationError` or `LoaderHttpError`). The trailing `**` route forwards
 * everything else to the SSR renderer.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: '500', renderMode: RenderMode.Server, status: 500 },
  { path: ':locale/404', renderMode: RenderMode.Server, status: 404 },
  { path: ':locale/500', renderMode: RenderMode.Server, status: 500 },
  { path: '**', renderMode: RenderMode.Server },
];
