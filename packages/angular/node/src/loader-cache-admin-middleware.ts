import type {
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@sitecore-content-sdk/angular';
import type { LoaderResultCache } from './loader-result-cache';

/**
 * Options for {@link createLoaderCacheAdminMiddleware}.
 * @public
 */
export interface LoaderCacheAdminMiddlewareOptions {
  /** Same cache instance as `/_data` / SSR. */
  loaderCache: LoaderResultCache;
  /**
   * GET-only path for JSON diagnostics (no Angular route).
   * @default '/admin/cache'
   */
  path?: string;
}

/**
 * Express middleware: **GET** {@link LoaderCacheAdminMiddlewareOptions.path} returns JSON from
 * {@link LoaderResultCache.getDiagnostics}. Place **before** static/SSR so the route is never handled by Angular.
 * @param {LoaderCacheAdminMiddlewareOptions} options - Cache instance and optional path
 * @returns Express middleware
 * @example
 * ```ts
 * app.use(createLoaderCacheAdminMiddleware({ loaderCache }));
 * ```
 * @public
 */
export function createLoaderCacheAdminMiddleware(
  options: LoaderCacheAdminMiddlewareOptions
): ExpressMiddleware {
  const { loaderCache, path = '/admin/cache' } = options;
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
      const diagnostics = await loaderCache.getDiagnostics();
      res.status(200).json(diagnostics);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };
}
