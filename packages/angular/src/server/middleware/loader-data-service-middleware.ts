import {
  LoaderPayload,
  LoaderRunnerInit,
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
  CsdkExpressRequest,
  LoaderRegistry,
} from '../models';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { ServerLoaderRunner } from '../server-loader-runner';
import { extractRequestData } from '../../loaders/utils';
import { AngularSitecoreConfig } from '../../config/define-config';

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
 * Parse POST body or GET query into LoaderPayload, or return a validation error.
 * @param {ExpressRequest} req - Incoming Express request
 */
function parseLoaderRequest(
  req: CsdkExpressRequest
): LoaderRunnerInit | { status: number; message: string } {
  if (req.method === 'POST') {
    const body = req.body as LoaderPayload;
    if (!body?.loaderId) return { status: 400, message: 'Missing loaderId' };
    // csdkRequestData is server-derived only — anything request-data-shaped in the
    // POST body is ignored so clients can't spoof site/variant resolution.
    return { ...body, csdkRequestData: extractRequestData(req) };
  }
  if (req.method === 'GET') {
    const loaderId = String(req.query?.loaderId ?? '');
    if (!loaderId) return { status: 400, message: 'Missing loaderId' };
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query ?? {})) {
      if (key !== 'loaderId' && key !== 'url' && typeof value === 'string') query[key] = value;
    }
    const csdkRequestData = extractRequestData(req) ?? null;
    return {
      loaderId,
      url: String(req.query?.url ?? ''),
      routeParams: {},
      query,
      csdkRequestData,
    };
  }
  return { status: 405, message: 'Method not allowed' };
}

/**
 * Create an Express middleware for the data endpoint.
 * This middleware handles both GET and POST requests at the configured endpoint path.
 *
 * The endpoint path must match the client: provide the same value to the Angular app via
 * FETCH_DATA_ENDPOINT (e.g. in app.config.ts). There is no Angular DI in Node/Express,
 * so you pass the endpoint here when calling this function (e.g. from server.ts).
 * @param {ExpressDataHandlerOptions} options - Handler options: loaders and optional endpoint (defaults to {@link LOADER_DATA_ENDPOINT})
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
