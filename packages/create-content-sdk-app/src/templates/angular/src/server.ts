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
  createBotTrackingMiddleware,
  createEditingConfigMiddleware,
  createEditingRenderMiddleware,
  createLoaderCache,
  createLoaderDataServiceMiddleware,
  createRobotsMiddleware,
  createMultisiteMiddleware,
  createPersonalizeMiddleware,
  createRedirectsMiddleware,
  createSitecoreRevalidateMiddleware,
  createSitemapMiddleware,
} from '@sitecore-content-sdk/angular';
import { LOADERS } from './content-sdk/loaders';
import { getClient } from './content-sdk/client/sitecore-client';
import { componentMap } from '.sitecore/component-map';
import sites from '.sitecore/sites.json';
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
    sites,
  })
);

/** Sitemap at `/sitemap.xml` and numbered `/sitemap-{id}.xml`. */
const sitemapMiddleware = createSitemapMiddleware({
  client: getClient(),
  sites,
});
app.use('/sitemap.xml', sitemapMiddleware);
app.use('/sitemap-:id.xml', sitemapMiddleware);

/** robots.txt at `/robots.txt`. */
app.use(
  '/robots.txt',
  createRobotsMiddleware({
    client: getClient(),
    sites,
  })
);

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
 * Shared path matcher for the request-scoped middlewares (multisite, redirects and personalize).
 * It decides which requests these middlewares act on.
 *
 * Patterns are exact strings or RegExp. The SDK already skips API routes (`/api/*`), Sitecore
 * routes (`/sitecore/*`), static files (any path whose last segment has an extension) and
 * editing/preview requests by default, so only list app-specific routes here.
 *
 *   excludePaths — additionally never processed
 *   includePaths — when set, ONLY matching paths are processed (everything else is skipped)
 */
const middlewareMatcher = {
  excludePaths: ['/healthz', '/metrics', /\.[^/]+$/],
  // includePaths: [/^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/], // e.g. restrict to locale-prefixed routes
};

/**
 * Multisite middleware. Resolves the site for each request (sc_site query → cookie →
 * hostname → default) from the generated site list and writes it onto `req.scParams`
 * for downstream loaders and the loader cache key. Must run before the personalize
 * middleware, which reads the resolved site.
 */
app.use(
  createMultisiteMiddleware({
    ...config.multisite,
    sites,
    defaultSite: config.defaultSite,
    matcher: middlewareMatcher,
  })
);

/*
 * Bot tracking middleware. Detects bots by User-Agent, sets the `sc_bot` cookie, and sends a
 * dedicated bot page-view event. Must run before personalize so the bot cookie is set before
 * personalize decides whether to skip. Does not run in dev/localhost environments.
 */
app.use(
  createBotTrackingMiddleware({
    ...config.api.edge,
    locales: config.angular.locales,
    defaultLanguage: config.defaultLanguage,
    defaultSite: config.defaultSite,
    matcher: middlewareMatcher,
  })
);

/**
 * Personalize middleware. Identifies page/component variants for the request via
 * Sitecore CDP and writes them onto `req.scParams` so the page loader fetches the
 * personalized layout and the loader cache keys per variant. Skips bot requests marked
 * by the bot tracking middleware (`skipForBot`, default true).
 *
 * NOTE: Personalize requires Edge configuration (contextId/clientContextId) and
 * cannot work with local containers
 */
app.use(
  createPersonalizeMiddleware({
    ...config.personalize,
    ...config.api.edge,
    locales: config.angular.locales,
    defaultLanguage: config.defaultLanguage,
    defaultSite: config.defaultSite,
    matcher: middlewareMatcher,
  })
);

/**
 * Redirects middleware. Matches each request against the site's Sitecore redirects (locale,
 * static and regex rules) and issues a 301/302 redirect or an internal server-transfer rewrite.
 * Runs after multisite (which resolves the site it fetches redirects for) and before personalize
 * so a redirect short-circuits the request before a CDP call is made.
 */
app.use(
  createRedirectsMiddleware({
    ...config.redirects,
    ...config.api.edge,
    ...(config.api.local ?? {}),
    sites,
    defaultLanguage: config.defaultLanguage,
    defaultSite: config.defaultSite,
    matcher: middlewareMatcher,
  })
);

/**
 * Loader data endpoint (/_data). Must use the same loaders as the client registry
 * so client-side navigation can fetch route data via POST /_data.
 */
app.use(createLoaderDataServiceMiddleware(config, { loaders: LOADERS, cache: loaderCache }));

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
 * The cache and the Node req/res ride on REQUEST_CONTEXT: the SSR loader resolver picks up the
 * cache, and the server analytics provider uses req/res for cookie-based CDP event dispatch.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req, { cache: loaderCache, req, res })
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch((err) => {
      next(err);
    });
});

/**
 * Start the server if this module is the main entry point
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 3000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env.PORT || 3000;
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
export default reqHandler;
