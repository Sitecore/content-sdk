import {
  LoaderApiRequest,
  LoaderApiResponse,
  LoaderContext,
  isLoaderRedirectResult,
  NotFoundNavigationError,
  RequestContext,
  LoaderHttpError,
} from '../loaders/models';
import { extractRequestContext } from '../loaders/utils';
import {
  ExpressDataHandlerOptions,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
  LoaderRegistry,
} from './models';
import { LOADER_DATA_ENDPOINT } from './constants';

/**
 * Execute a loader and return the API response
 * @param {LoaderApiRequest} request - The loader data request
 * @param {LoaderRegistry} loaders - The loader registry
 * @param {RequestContext} [requestContext] - The request context
 * @returns {Promise<LoaderApiResponse>} Promise resolving to the API response
 */
async function executeLoader(
  request: LoaderApiRequest,
  loaders: LoaderRegistry,
  requestContext: RequestContext | undefined
): Promise<LoaderApiResponse> {
  const { loaderId, url, params, query } = request;

  const loader = loaders[loaderId];
  if (!loader) {
    return {
      kind: 'error',
      status: 500,
      message: `No loader registered for id "${loaderId}"`,
    };
  }

  const context: LoaderContext = {
    url,
    params,
    query,
    requestContext,
  };

  try {
    const result = await loader(context);
    if (isLoaderRedirectResult(result)) {
      return {
        kind: 'redirect',
        data: {
          loaderRedirectTarget: result.loaderRedirectTarget,
          status: result.status,
        },
      };
    }
    return {
      kind: 'data',
      data: result,
    };
  } catch (error) {
    if (error instanceof NotFoundNavigationError) {
      return {
        kind: 'notFound',
        status: 404,
      };
    }
    if (error instanceof LoaderHttpError) {
      return {
        kind: 'error',
        status: error.status,
        message: error.message,
      };
    }
    const message = error instanceof Error ? error.message : 'Loader failed';
    return {
      kind: 'error',
      status: 500,
      message,
    };
  }
}

/**
 * Send the loader response to Express
 */
function sendResponse(res: ExpressResponse, result: LoaderApiResponse): void {
  res.json(result);
}

/** Parse POST body or GET query into LoaderApiRequest, or return a validation error. */
function parseLoaderRequest(
  req: ExpressRequest
): LoaderApiRequest | { status: number; message: string } {
  if (req.method === 'POST') {
    const body = req.body as LoaderApiRequest;
    if (!body?.loaderId) return { status: 400, message: 'Missing loaderId' };
    return body;
  }
  if (req.method === 'GET') {
    const loaderId = String(req.query?.loaderId ?? '');
    if (!loaderId) return { status: 400, message: 'Missing loaderId' };
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query ?? {})) {
      if (key !== 'loaderId' && key !== 'url' && typeof value === 'string') query[key] = value;
    }
    return {
      loaderId,
      url: String(req.query?.url ?? ''),
      params: {},
      query,
    };
  }
  return { status: 405, message: 'Method not allowed' };
}

/**
 * Create an Express middleware for the data endpoint.
 * This middleware handles both GET and POST requests at the configured endpoint path.
 *
 * The endpoint path must match the client: provide the same value to the Angular app via
 * {@link FETCH_DATA_ENDPOINT} (e.g. in app.config.ts). There is no Angular DI in Node/Express,
 * so you pass the endpoint here when calling this function (e.g. from server.ts).
 *
 * @param options - Handler options: loaders and optional endpoint (defaults to {@link LOADER_DATA_ENDPOINT})
 * @returns Express middleware that handles the data endpoint
 * @example
 * ```typescript
 * import { createExpressDataMiddleware, LOADER_DATA_ENDPOINT } from '@sitecore-content-sdk/angular';
 *
 * // Use default endpoint (same as client when FETCH_DATA_ENDPOINT is not provided)
 * app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));
 *
 * // Or pass the same endpoint you provide to the Angular app (FETCH_DATA_ENDPOINT)
 * const dataEndpoint = process.env.DATA_ENDPOINT ?? LOADER_DATA_ENDPOINT;
 * app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS, endpoint: dataEndpoint }));
 * ```
 * @public
 */
export function createLoaderDataServiceMiddleware(
  options: ExpressDataHandlerOptions
): ExpressMiddleware {
  const {
    loaders,
    endpoint = LOADER_DATA_ENDPOINT,
    extractRequestContext: extractReq = extractRequestContext,
  } = options;
  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    if (req.path !== endpoint) {
      next();
      return;
    }
    const requestContext = extractReq(req);
    try {
      const parsed = parseLoaderRequest(req);
      if ('loaderId' in parsed) {
        const result = await executeLoader(parsed, loaders, requestContext);
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
