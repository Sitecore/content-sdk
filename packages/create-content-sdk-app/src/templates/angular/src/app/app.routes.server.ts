import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server route config. Define 404 and 500 with status so that when the loader resolver
 * redirects to the not-found or error route (e.g. after NotFoundNavigationError or LoaderHttpError),
 * the server responds with the correct HTTP status code instead of 200.
 *
 * Include `:lang/404` and `:lang/500` so localized error URLs (e.g. `/fr/404`) get the right status.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '500', renderMode: RenderMode.Server, status: 500 },
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: ':lang/500', renderMode: RenderMode.Server, status: 500 },
  { path: ':lang/404', renderMode: RenderMode.Server, status: 404 },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
