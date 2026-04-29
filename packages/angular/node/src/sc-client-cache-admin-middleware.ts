import type {
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@sitecore-content-sdk/angular';
import type { ScClientCache } from './sc-client-cache';

/**
 * Options for {@link createScClientCacheAdminMiddleware}.
 * @public
 */
export interface ScClientCacheAdminMiddlewareOptions {
  /** Same cache instance as SSR / {@link createScClientDataMiddleware}. */
  scClientCache: ScClientCache;
  /**
   * GET-only path for JSON diagnostics (no Angular route).
   * @default '/admin/cache'
   */
  path?: string;
}

/**
 * Express middleware: **GET** {@link ScClientCacheAdminMiddlewareOptions.path} returns JSON from
 * {@link ScClientCache.getDiagnostics}. Place **before** static/SSR so the route is never handled by Angular.
 * @param options - Cache instance and optional path
 * @returns Express middleware
 * @example
 * ```ts
 * import { ScClientCache, createScClientCacheAdminMiddleware } from '@sitecore-content-sdk/angular/node';
 * const scClientCache = ScClientCache.forConfig(scConfig);
 * app.use(createScClientCacheAdminMiddleware({ scClientCache }));
 * ```
 * @public
 */
export function createScClientCacheAdminMiddleware(
  options: ScClientCacheAdminMiddlewareOptions
): ExpressMiddleware {
  const { scClientCache, path = '/admin/cache' } = options;
  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    if (req.path !== path) {
      next();
      return;
    }
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
    try {
      const diagnostics = await scClientCache.getDiagnostics();
      res.status(200).json(diagnostics);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };
}
