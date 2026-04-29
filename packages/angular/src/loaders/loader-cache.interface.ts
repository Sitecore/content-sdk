import type { LoaderApiResponse, LoaderRedirectResult } from './models';

/**
 * Loader result cache contract (server implementation uses unstorage; browser uses {@link NullLoaderCache}).
 * @public
 */
export interface LoaderResultCacheStore {
  /** Whether caching is enabled for the current Sitecore config. */
  isEnabled(): boolean;

  /**
   * Get cached response, or null if not cached or expired.
   * @param key - Cache key material
   */
  get(key: string): Promise<LoaderApiResponse | null>;

  /**
   * Persist a cacheable response.
   * @param key - Cache key material
   * @param response - Response to store
   */
  set(key: string, response: LoaderApiResponse): Promise<void>;
}

/**
 * Cache key for server-side loader results.
 * Uses double-underscore separator to avoid path issues with fs-based cache drivers.
 * @param {string} loaderId - Loader id
 * @param {string} url - Route URL
 * @public
 */
export function buildLoaderCacheKeyString(loaderId: string, url: string): string {
  const safeUrl = url.replace(/[:/\\]/g, '_');
  return `loader__${loaderId}__${safeUrl}`;
}

/**
 * Whether a loader API response may be stored in the result cache.
 * @param {LoaderApiResponse} response - Loader API response
 * @public
 */
export function shouldCacheLoaderResponse(response: LoaderApiResponse): boolean {
  return response.kind === 'data' || response.kind === 'redirect';
}

/**
 * Normalize loader API payloads read from persistent cache (legacy entries used `redirect` instead of `data`).
 * @internal
 */
export function normalizeCachedLoaderResponse(response: LoaderApiResponse): LoaderApiResponse {
  if (response.kind !== 'redirect') {
    return response;
  }
  const r = response as LoaderApiResponse & {
    data?: LoaderRedirectResult;
    redirect?: LoaderRedirectResult;
  };
  if (r.data !== undefined) {
    return { kind: 'redirect', data: r.data };
  }
  if (r.redirect !== undefined) {
    return { kind: 'redirect', data: r.redirect };
  }
  return response;
}

/**
 * No-op cache for browser bundles: never enabled, no persistence.
 * @public
 */
export class NullLoaderCache implements LoaderResultCacheStore {
  isEnabled(): boolean {
    return false;
  }

  async get(key: string): Promise<LoaderApiResponse | null> {
    void key;
    return null;
  }

  async set(key: string, response: LoaderApiResponse): Promise<void> {
    void key;
    void response;
  }
}

/** Shared null-cache instance for default DI. @public */
export const NULL_LOADER_CACHE = new NullLoaderCache();
