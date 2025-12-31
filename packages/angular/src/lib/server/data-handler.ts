import { LoaderApiRequest, LoaderApiResponse } from '../api';
import { LoaderContext, LoaderFn } from '../types';
import { LoaderRedirect, LoaderNotFound, LoaderHttpError } from '../loader-resolver';
import { DEFAULT_DATA_ENDPOINT, DataHandlerConfig } from './config';

/**
 * Loader registry type - maps loader IDs to loader functions
 * @public
 */
export type LoaderRegistry = Record<string, LoaderFn>;

/**
 * Options for the data handler
 * @public
 */
export interface DataHandlerOptions extends DataHandlerConfig {
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
 * Create a JSON response
 */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Send the loader response as a fetch Response
 */
function createResponse(result: LoaderApiResponse): Response {
  if (result.kind === 'redirect') {
    return jsonResponse(result);
  } else if (result.kind === 'notFound') {
    return jsonResponse(result, 404);
  } else if (result.kind === 'error') {
    return jsonResponse(result, result.status);
  } else {
    return jsonResponse(result, 200);
  }
}

/**
 * Create a data handler middleware using the Web Fetch API.
 * This handler checks the request path and handles requests at the configured endpoint.
 * The endpoint path defaults to '/_data' and is kept in sync with the client-side loader resolver.
 * @param options - Handler options including the loader registry and optional endpoint path
 * @returns A function that handles Request and returns Response or null if path doesn't match
 * @example
 * ```typescript
 * import { createDataMiddleware } from '@sitecore-content-sdk/angular';
 *
 * const middleware = createDataMiddleware({ loaders: SERVER_LOADERS });
 *
 * // In your server handler
 * export async function handler(request: Request): Promise<Response> {
 *   const dataResponse = await middleware(request);
 *   if (dataResponse) return dataResponse;
 *
 *   // Handle other requests...
 * }
 * ```
 * @public
 */
export function createDataMiddleware(
  options: DataHandlerOptions
): (request: Request) => Promise<Response | null> {
  const { loaders, endpoint = DEFAULT_DATA_ENDPOINT } = options;

  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url);

    // Check if request matches the endpoint
    if (url.pathname !== endpoint) {
      return null;
    }

    try {
      if (request.method === 'POST') {
        // POST: parse body
        const body = (await request.json()) as LoaderApiRequest;

        if (!body.loaderId) {
          return jsonResponse({ kind: 'error', status: 400, message: 'Missing loaderId' }, 400);
        }

        const result = await executeLoader(body, loaders);
        return createResponse(result);
      } else {
        // Method not allowed
        return jsonResponse({ kind: 'error', status: 405, message: 'Method not allowed' }, 405);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return jsonResponse({ kind: 'error', status: 500, message }, 500);
    }
  };
}
