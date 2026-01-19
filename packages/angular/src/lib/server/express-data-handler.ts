import { LoaderApiRequest, LoaderApiResponse } from '../api';
import { LoaderContext, LoaderFn } from '../types';
import { LoaderRedirect, LoaderNotFound, LoaderHttpError } from '../loader-resolver';
import { DEFAULT_DATA_ENDPOINT, DataHandlerConfig } from './config';

/**
 * Minimal Express Request interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressRequest {
  method: string;
  path: string;
  url: string;
  body: unknown;
  query: Record<string, string | string[] | undefined>;
}

/**
 * Minimal Express Response interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(data: unknown): void;
}

/**
 * Express next function type
 * @public
 */
export type ExpressNextFunction = (error?: unknown) => void;

/**
 * Express-compatible middleware type
 * @public
 */
export type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => void | Promise<void>;

/**
 * Loader registry type - maps loader IDs to loader functions
 * @public
 */
export type LoaderRegistry = Record<string, LoaderFn>;

/**
 * Options for the Express data handler
 * @public
 */
export interface ExpressDataHandlerOptions extends DataHandlerConfig {
  /**
   * The loader registry containing all registered loaders
   */
  loaders: LoaderRegistry;
}

/**
 * Execute a loader and return the API response
 */
async function executeLoader(
  request: LoaderApiRequest,
  loaders: LoaderRegistry
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
  };

  try {
    const data = await loader(context);
    return {
      kind: 'data',
      data,
    };
  } catch (error) {
    if (error instanceof LoaderRedirect) {
      return {
        kind: 'redirect',
        location: error.location,
        status: error.status,
      };
    }

    if (error instanceof LoaderNotFound) {
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
 * @param options - Handler options including the loader registry and optional endpoint path
 * @returns Express middleware that handles the data endpoint
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

    try {
      if (req.method === 'POST') {
        // POST: parse body
        const body = req.body as LoaderApiRequest;

        if (!body.loaderId) {
          res.status(400).json({ kind: 'error', status: 400, message: 'Missing loaderId' });
          return;
        }

        const result = await executeLoader(body, loaders);
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

        const result = await executeLoader(loaderRequest, loaders);
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
