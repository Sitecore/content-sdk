import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import {
  createExpressDataMiddleware,
  createExpressEditingConfigMiddleware,
  createExpressMultisiteMiddleware,
  createExpressPersonalizeMiddleware,
} from '@sitecore-content-sdk/angular';
import { SERVER_LOADERS } from './lib/loaders';
import { componentMap } from '../.sitecore/component-map';
import metadata from '../.sitecore/metadata.json';
import scConfig from './sitecore.config';
import sites from './sites.json';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

app.use(cookieParser());

app.use(createExpressMultisiteMiddleware({ sites }));

app.use(
  createExpressPersonalizeMiddleware({
    // Enable/disable personalization
    enabled: !!scConfig.api?.edge?.contextId,
    sites,
    edge: {
      contextId: scConfig.api?.edge?.contextId,
      clientContextId: scConfig.api?.edge?.clientContextId,
      edgeUrl: scConfig.api?.edge?.edgeUrl,
    },
    defaultLanguage: scConfig.defaultLanguage,
  })
);

app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));

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
 * Angular's REQUEST token is automatically provided during SSR and can be
 * injected in loaders to access request context for site resolution.
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
