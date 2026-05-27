import './load-env';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import fsDriver from 'unstorage/drivers/fs';
import memoryDriver from 'unstorage/drivers/memory';
import {
  createCacheAdminMiddleware,
  createLoaderCache,
  createLoaderDataServiceMiddleware,
  createSitecoreRevalidateMiddleware,
} from '@sitecore-content-sdk/angular';
import { LOADERS } from './content-sdk/loaders';
import config from '../sitecore.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Loader cache driver selection (server only).
 *
 *   LOADER_CACHE_DRIVER unset            → in-memory Map (default)
 *   LOADER_CACHE_DRIVER=unstorage-memory → unstorage with memory driver
 *   LOADER_CACHE_DRIVER=unstorage-fs     → unstorage with fs driver (persists)
 *
 * The fs driver writes to `./.cache/loaders/<key>.json`, surviving process restarts.
 */
const driverChoice = process.env.LOADER_CACHE_DRIVER;
const driver =
  driverChoice === 'unstorage-fs'
    ? fsDriver({ base: './.cache/loaders' })
    : driverChoice === 'unstorage-memory'
      ? memoryDriver()
      : undefined;

const loaderCache = createLoaderCache({
  revalidate: config.angular.isrCache.revalidate,
  enabled: config.angular.isrCache.enabled,
  defaultSiteName: config.defaultSite,
  ...(driver ? { driver } : {}),
});

app.use(express.json());

/** Production webhook: POST /api/revalidate (Sitecore Edge OSR). */
app.use(
  createSitecoreRevalidateMiddleware({
    cache: loaderCache,
    defaultLocale: config.defaultLanguage,
    sites: [
      {
        name: config.defaultSite,
        hostName: '*',
        language: config.defaultLanguage,
      },
    ],
  })
);

/** Admin endpoints for cache inspection and invalidation (see `/api/_cache`). */
app.use(createCacheAdminMiddleware({ cache: loaderCache, endpoint: '/api/_cache' }));

/**
 * Loader data endpoint (/_data). Must use the same loaders as the client registry
 * so client-side navigation can fetch route data via POST /_data.
 */
app.use(createLoaderDataServiceMiddleware({ loaders: LOADERS, cache: loaderCache }));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 * The cache reference rides on REQUEST_CONTEXT so the SSR loader resolver
 * picks it up via inject(REQUEST_CONTEXT).
 */
app.use((req, res, next) => {
  angularApp
    .handle(req, { cache: loaderCache })
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch((err) => {
      next(err);
    });
});

/**
 * Start the server if this module is the main entry point
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env.PORT || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
