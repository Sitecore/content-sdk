import {
  LoaderApiResponse,
  NotFoundNavigationError,
  LoaderHttpError,
  LoaderDataResult,
  LoaderCache,
} from '../../loaders/models';
import {
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from './models';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { ServerLoaderRunner } from '../server-loader-runner';
import { parseLoaderRequest } from './utils';
import { AngularSitecoreConfig } from '../../config/define-config';
import { LoaderRegistry } from '../../loaders/loader-registry.token';

/**
 * Options for the Express data handler
 * @public
 */
export interface LoaderDataServiceOptions {
  /**
   * The shared loader registry (same object as provideLoaderRegistry).
   */
  loaders: LoaderRegistry;
  /**
   * Optional loader cache. When supplied, /_data responses go through
   * cache-aside; omit to run loaders directly on every request.
   */
  cache: LoaderCache;
  /**
   * The endpoint path for the data handler.
   * @default '/_data'
   */
  endpoint?: string;
}

/**
 * Map loader resolution result to wire-level API response.
 * @param {LoaderDataResult} result - Loader result from the shared registry
 * @returns {LoaderApiResponse} Wire envelope for the client
 */
function toApiResponse(result: LoaderDataResult): LoaderApiResponse {
  if (result.kind === 'redirect') {
    return {
      kind: 'redirect',
      redirect: {
        loaderRedirectTarget: result.redirect.loaderRedirectTarget,
        status: result.redirect.status,
      },
    };
  }

  if (result.kind === 'error') {
    const cause = result.cause;
    if (cause instanceof NotFoundNavigationError) {
      return { kind: 'notFound', status: 404 };
    }
    if (cause instanceof LoaderHttpError) {
      return { kind: 'error', status: cause.status, message: cause.message };
    }
    return { kind: 'error', status: result.status, message: result.message };
  }

  return { kind: 'data', data: result.data };
}

/**
 * Send the loader response to Express
 * @param {ExpressResponse} res - Express response
 * @param {LoaderApiResponse} result - Loader API payload to JSON-encode
 */
function sendResponse(res: ExpressResponse, result: LoaderApiResponse): void {
  res.json(result);
}

/**
 * Create an Express middleware for the data endpoint.
 * This middleware handles both GET and POST requests at the configured endpoint path.
 *
 * The endpoint path must match the client: provide the same value to the Angular app via
 * FETCH_DATA_ENDPOINT (e.g. in app.config.ts). There is no Angular DI in Node/Express,
 * so you pass the endpoint here when calling this function (e.g. from server.ts).
 * @param {AngularSitecoreConfig} config - Resolved Sitecore configuration (drives default site/locale).
 * @param {LoaderDataServiceOptions} options - Handler options: loaders, cache, and optional endpoint (defaults to {@link LOADER_DATA_ENDPOINT})
 * @returns Express middleware that handles the data endpoint
 * @example
 * ```typescript
 * import { createExpressDataMiddleware, LOADER_DATA_ENDPOINT } from '@sitecore-content-sdk/angular';
 *
 * // Pass the same LOADERS object used with provideLoaderRegistry(LOADERS)
 * app.use(createExpressDataMiddleware({ loaders: LOADERS }));
 *
 * // Or pass the same endpoint you provide to the Angular app (FETCH_DATA_ENDPOINT)
 * const dataEndpoint = process.env.DATA_ENDPOINT ?? LOADER_DATA_ENDPOINT;
 * app.use(createExpressDataMiddleware({ loaders: LOADERS, endpoint: dataEndpoint }));
 * ```
 * @public
 */
export function createLoaderDataServiceMiddleware(
  config: AngularSitecoreConfig,
  options: LoaderDataServiceOptions
): ExpressMiddleware {
  const { loaders, cache, endpoint = LOADER_DATA_ENDPOINT } = options;
  const serverLoaderRunner = new ServerLoaderRunner(loaders, config, cache);

  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    if (req.path !== endpoint) {
      next();
      return;
    }
    try {
      const parsed = parseLoaderRequest(req);
      if ('loaderId' in parsed) {
        const result = toApiResponse(await serverLoaderRunner.resolve(parsed));
        sendResponse(res, result);
      } else {
        res
          .status(parsed.status)
          .json({ kind: 'error', status: parsed.status, message: parsed.message });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ kind: 'error', status: 500, message });
    }
  };
}

/** @public */
export const createExpressDataMiddleware = createLoaderDataServiceMiddleware;
