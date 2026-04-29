import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type {
  ScClientCacheRequest,
  ScClientCacheResponse,
  ScClientCacheStore,
} from '../client/sc-client-cache.interface';
import {
  buildPageCacheKey,
  buildDictionaryCacheKey,
} from '../client/sc-client-cache.interface';
import type {
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from './models';
import { SC_CLIENT_DATA_ENDPOINT } from '../client/angular-sitecore-client.service';

/**
 * Options for the scClient data middleware.
 * @public
 */
export interface ScClientDataMiddlewareOptions {
  /**
   * The SitecoreClient instance to use for API calls.
   */
  sitecoreClient: SitecoreClient;
  /**
   * Optional cache store. When provided, responses are cached/retrieved.
   */
  cache?: ScClientCacheStore | null;
  /**
   * Endpoint path for the middleware.
   * @default '/_sc-client'
   */
  endpoint?: string;
}

/**
 * Execute scClient method and return cached or fresh response.
 */
async function executeRequest(
  request: ScClientCacheRequest,
  client: SitecoreClient,
  cache: ScClientCacheStore | null
): Promise<ScClientCacheResponse> {
  if (request.method === 'getPage') {
    const cacheKey = buildPageCacheKey(request.path, request.options);

    // Try cache
    if (cache?.isEnabled()) {
      const cached = await cache.get(cacheKey);
      if (cached?.kind === 'page') {
        return cached;
      }
    }

    // Cache miss - call client
    const result = await client.getPage(request.path, request.options);
    const response: ScClientCacheResponse = { kind: 'page', data: result };

    // Write to cache
    if (cache?.isEnabled()) {
      await cache.set(cacheKey, response);
    }

    return response;
  }

  if (request.method === 'getDictionary') {
    const cacheKey = buildDictionaryCacheKey(request.options);

    // Try cache
    if (cache?.isEnabled()) {
      const cached = await cache.get(cacheKey);
      if (cached?.kind === 'dictionary') {
        return cached;
      }
    }

    // Cache miss - call client
    const result = await client.getDictionary(request.options);
    const response: ScClientCacheResponse = { kind: 'dictionary', data: result };

    // Write to cache
    if (cache?.isEnabled()) {
      await cache.set(cacheKey, response);
    }

    return response;
  }

  throw new Error(`Unknown method: ${(request as { method: string }).method}`);
}

/**
 * Validate incoming request body.
 */
function parseRequest(req: ExpressRequest): ScClientCacheRequest | { error: string } {
  const body = req.body as Partial<ScClientCacheRequest>;

  if (!body?.method) {
    return { error: 'Missing method' };
  }

  if (body.method === 'getPage') {
    if (typeof body.path !== 'string') {
      return { error: 'Missing path for getPage' };
    }
    return { method: 'getPage', path: body.path, options: body.options };
  }

  if (body.method === 'getDictionary') {
    return { method: 'getDictionary', options: body.options };
  }

  return { error: `Unknown method: ${body.method}` };
}

/**
 * Create Express middleware for scClient data endpoint.
 * Handles POST requests to fetch page/dictionary data with caching.
 *
 * @example
 * ```typescript
 * import { createScClientDataMiddleware } from '@sitecore-content-sdk/angular';
 * import { ScClientCache } from '@sitecore-content-sdk/angular/node';
 *
 * const scClientCache = ScClientCache.forConfig(scConfig);
 * app.use(express.json());
 * app.use(createScClientDataMiddleware({
 *   sitecoreClient: scClient,
 *   cache: scClientCache,
 * }));
 * ```
 * @public
 */
export function createScClientDataMiddleware(
  options: ScClientDataMiddlewareOptions
): ExpressMiddleware {
  const { sitecoreClient, cache = null, endpoint = SC_CLIENT_DATA_ENDPOINT } = options;

  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    if (req.path !== endpoint) {
      next();
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const parsed = parseRequest(req);

      if ('error' in parsed) {
        res.status(400).json({ error: parsed.error });
        return;
      }

      const response = await executeRequest(parsed, sitecoreClient, cache);
      res.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };
}
