import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  createExpressDataMiddleware,
  createExpressEditingConfigMiddleware,
} from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from './lib/loaders';
import { componentMap } from '../.sitecore/component-map';
import metadata from '../.sitecore/metadata.json';
import scConfig from './sitecore.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Parse JSON body for POST requests
 */
app.use(express.json());

/**
 * Data middleware for client-side loader requests.
 * Uses the reusable middleware from @sitecore-content-sdk/angular.
 * Handles requests at /_data endpoint (configurable via options.endpoint).
 */
app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));

/**
 * Editing config middleware for XM Cloud Pages integration.
 * Provides configuration information at /api/editing/config endpoint.
 */
app.use(
  createExpressEditingConfigMiddleware({
    components: componentMap,
    metadata,
    editingSecret: scConfig.editingSecret,
  })
);

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
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env.pm_id) {
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
