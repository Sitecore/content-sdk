import {
  LoaderApiRequest,
  LoaderApiResponse,
  LoaderContext,
  NotFoundNavigationError,
  RequestContext,
  LoaderHttpError,
} from '../loaders/models';
import { extractRequestContext } from '../loaders/utils';
import {
  DEFAULT_DATA_ENDPOINT,
  ExpressDataHandlerOptions,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
  LoaderRegistry,
} from './models';

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
  requestContext?: RequestContext
): Promise<LoaderApiResponse> {
  const { loaderId, url, params, query } = request;

  const loader = loaders[loaderId];
  if (!loader) {
    return {
      kind: 'notFound',
      status: 404,
    };
  }

  const context: LoaderContext = {
    url,
    params,
    query,
    requestContext,
  };

  try {
    const data = await loader(context);
    return {
      kind: 'data',
      data,
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

    // Generic error
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
 * @param {ExpressResponse} res - The Express response object
 * @param {LoaderApiResponse} result - The loader API response
 */
function sendResponse(res: ExpressResponse, result: LoaderApiResponse): void {
  if (result.kind === 'redirect') {
    // Return 200 with redirect info for client-side handling
    res.json(result);
  } else if (result.kind === 'notFound') {
    res.json(result);
  } else if (result.kind === 'error') {
    res.json(result);
  } else {
    res.json(result);
  }
}

/**
 * Create an Express middleware for the data endpoint.
 * This middleware handles both GET and POST requests at the configured endpoint path.
 * The endpoint path defaults to '/_data' and is kept in sync with the client-side loader resolver.
 * @param {ExpressDataHandlerOptions} options - Handler options including the loader registry and optional endpoint path
 * @returns {ExpressMiddleware} Express middleware that handles the data endpoint
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressDataMiddleware } from '@sitecore-content-sdk/angular';
 * import { SERVER_LOADERS } from './lib/loaders';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Mount the data handler middleware (handles /_data by default)
 * app.use(createExpressDataMiddleware({ loaders: SERVER_LOADERS }));
 *
 * // Or with custom endpoint
 * app.use(createExpressDataMiddleware({
 *   loaders: SERVER_LOADERS,
 *   endpoint: '/api/data'
 * }));
 * ```
 * @public
 */
export function createExpressDataMiddleware(options: ExpressDataHandlerOptions): ExpressMiddleware {
  const { loaders, endpoint = DEFAULT_DATA_ENDPOINT } = options;
  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    // Check if request matches the endpoint
    if (req.path !== endpoint) {
      next();
      return;
    }
    // Extract request context for loaders
    const requestContext = extractRequestContext(req);
    try {
      if (req.method === 'POST') {
        // POST: parse body
        const body = req.body as LoaderApiRequest;

        if (!body.loaderId) {
          res.status(400).json({ kind: 'error', status: 400, message: 'Missing loaderId' });
          return;
        }

        const result = await executeLoader(body, loaders, requestContext);
        sendResponse(res, result);
      } else if (req.method === 'GET') {
        // GET: use query parameters
        const loaderId = String(req.query.loaderId || '');
        const url = String(req.query.url || '');

        if (!loaderId) {
          res.status(400).json({ kind: 'error', status: 400, message: 'Missing loaderId' });
          return;
        }

        // Build query object excluding loaderId and url
        const query: Record<string, string> = {};
        for (const [key, value] of Object.entries(req.query)) {
          if (key !== 'loaderId' && key !== 'url' && typeof value === 'string') {
            query[key] = value;
          }
        }

        const loaderRequest: LoaderApiRequest = {
          loaderId,
          url,
          params: {},
          query,
        };

        const result = await executeLoader(loaderRequest, loaders, requestContext);
        sendResponse(res, result);
      } else {
        // Method not allowed
        res.status(405).json({ kind: 'error', status: 405, message: 'Method not allowed' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ kind: 'error', status: 500, message });
    }
  };
}
