/**
 * Singleton loader result cache shared between Express middleware and Angular SSR.
 * Call {@link getLoaderResultCache} from both `server.ts` and `app.config.server.ts` so the same instance is used.
 */
import { LoaderResultCache } from '@sitecore-content-sdk/angular/node';
import scConfig from '../../sitecore.config';

let _loaderResultCache: LoaderResultCache | null = null;

/**
 * Returns the singleton loader result cache, creating it on first access.
 * Lazy initialization avoids touching cache/config during Angular's build-time route extraction
 * when server-only setup has not run yet.
 */
export function getLoaderResultCache(): LoaderResultCache {
  if (!_loaderResultCache) {
    _loaderResultCache = LoaderResultCache.forConfig(scConfig);
  }
  return _loaderResultCache;
}
