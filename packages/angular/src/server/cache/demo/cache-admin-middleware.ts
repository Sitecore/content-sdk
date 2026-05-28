/* eslint-disable */
/**
 * This middleware is only used for testing and should be removed before release.
 * TODO: Remove this middleware before release.
 */
import { ExpressMiddleware, ExpressNextFunction, ExpressRequest, ExpressResponse } from '../../models';
import { InvalidateInput, LoaderCache } from '../../../loaders/models';

/**
 * Options for the admin middleware.
 * @public
 */
export interface CacheAdminMiddlewareOptions {
  /** The cache instance to expose. Capture once in `server.ts`. */
  cache: LoaderCache;
  /** Base path. Defaults to `/api/_cache`. */
  endpoint?: string;
  /**
   * Optional auth gate. Return true to allow. Defaults to allowing everything,
   * which is fine for local demos — *do not* leave that default in a deploy.
   */
  auth?: (req: ExpressRequest) => boolean;
}

const DEFAULT_ENDPOINT = '/api/_cache';

/**
 * Lightweight admin surface for the loader cache:
 *   GET    <endpoint>/entries        → list entries (metadata only, no values)
 *   POST   <endpoint>/invalidate     → mark stale by tags (JSON body)
 *   POST   <endpoint>/flush          → flush every entry
 *   GET    <endpoint>/config         → resolved config (for the demo UI)
 * @public
 */
export function createCacheAdminMiddleware(
  options: CacheAdminMiddlewareOptions
): ExpressMiddleware {
  const { cache } = options;
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const auth = options.auth ?? (() => true);

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    if (!req.path.startsWith(endpoint + '/')) {
      next();
      return;
    }
    if (!auth(req)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    const action = req.path.slice(endpoint.length + 1);

    try {
      if (action === 'entries' && req.method === 'GET') {
        const entries = await cache.entries();
        res.status(200).json({ entries, now: Date.now() });
        return;
      }

      if (action === 'config' && req.method === 'GET') {
        res.status(200).json({ ...cache.getConfig() });
        return;
      }

      if (action === 'invalidate' && req.method === 'POST') {
        const body = (req.body ?? {}) as Partial<InvalidateInput>;
        const hasTags = Array.isArray(body.tags) && body.tags.length > 0;
        if (!hasTags) {
          res.status(400).json({ error: 'non-empty `tags` array is required' });
          return;
        }
        const marked = await cache.invalidate(body as InvalidateInput);
        res.status(200).json({ marked });
        return;
      }

      if (action === 'flush' && req.method === 'POST') {
        await cache.flush();
        res.status(200).json({ ok: true });
        return;
      }

      res.status(404).json({ error: `unknown cache admin action: ${action}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'cache admin error';
      res.status(500).json({ error: message });
    }
  };
}
