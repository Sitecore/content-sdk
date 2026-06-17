import './load-env';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import memoryDriver from 'unstorage/drivers/memory';
import {
  createCacheAdminMiddleware,
  createEditingConfigMiddleware,
  createEditingRenderMiddleware,
  createLoaderCache,
  createLoaderDataServiceMiddleware,
  createSitecoreRevalidateMiddleware,
} from '@sitecore-content-sdk/angular';
import { LOADERS } from './content-sdk/loaders';
import { componentMap } from '.sitecore/component-map';
import config from '../sitecore.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Loader cache driver selection (server only).
 * Uses unstorage memoryDriver by default
 * Can be considered with other drivers, for example fsDriver:
 * import fsDriver from 'unstorage/drivers/fs';
 * ...
 * const driver = fsDriver({ base: './.cache/loaders' })
 */
const driver = memoryDriver();

const loaderCache = createLoaderCache({
  revalidate: config.angular.loadersCache.revalidate,
  enabled: config.angular.loadersCache.enabled,
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
 * Editing config endpoint (`/api/editing/config`). Replies with the registered
 * component map keys and `editMode: 'metadata'` so Sitecore Pages can negotiate
 * editor capabilities before the first render request.
 */
app.use(
  createEditingConfigMiddleware({
    components: componentMap,
    metadataImport: () => import('.sitecore/metadata.json'),
  })
);

/**
 * Editing render endpoint (`/api/editing/render`). Rewrites `req.url` to the
 * editor's requested route, stashes the preview payload on the request, then
 * lets the Angular SSR engine render the page in-process.
 */
app.use(createEditingRenderMiddleware());

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
