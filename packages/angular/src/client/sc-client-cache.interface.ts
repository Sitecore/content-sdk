import type { Page, PageOptions } from '@sitecore-content-sdk/content/client';
import type { DictionaryPhrases } from '@sitecore-content-sdk/content/i18n';
import type { RouteOptions } from '@sitecore-content-sdk/content/layout';

/**
 * Cached response types for scClient methods.
 * @public
 */
export type ScClientCacheResponse =
  | { kind: 'page'; data: Page | null }
  | { kind: 'dictionary'; data: DictionaryPhrases };

/**
 * Request types for scClient cache endpoint.
 * @public
 */
export type ScClientCacheRequest =
  | { method: 'getPage'; path: string; options?: PageOptions }
  | { method: 'getDictionary'; options?: Partial<RouteOptions> };

/**
 * Cache store contract for scClient results.
 * Browser uses {@link NullScClientCache}; server uses unstorage-backed implementation.
 * @public
 */
export interface ScClientCacheStore {
  /** Whether caching is enabled. */
  isEnabled(): boolean;

  /**
   * Get cached response, or null if not cached or expired.
   * @param key - Cache key
   */
  get(key: string): Promise<ScClientCacheResponse | null>;

  /**
   * Persist a response.
   * @param key - Cache key
   * @param response - Response to store
   */
  set(key: string, response: ScClientCacheResponse): Promise<void>;
}

/**
 * Build cache key for getPage calls.
 * @param path - Route path
 * @param options - Page options (site, locale, personalize)
 * @public
 */
export function buildPageCacheKey(path: string, options?: PageOptions): string {
  const site = options?.site ?? '_default';
  const locale = options?.locale ?? '_default';
  const variantId = options?.personalize?.variantId ?? '_none';
  const safePath = path.replace(/[:/\\]/g, '_');
  return `page__${site}__${locale}__${variantId}__${safePath}`;
}

/**
 * Build cache key for getDictionary calls.
 * @param options - Route options (site, locale)
 * @public
 */
export function buildDictionaryCacheKey(options?: Partial<RouteOptions>): string {
  const site = options?.site ?? '_default';
  const locale = options?.locale ?? '_default';
  return `dictionary__${site}__${locale}`;
}

/**
 * No-op cache for browser bundles: never enabled, no persistence.
 * @public
 */
export class NullScClientCache implements ScClientCacheStore {
  isEnabled(): boolean {
    return false;
  }

  async get(_key: string): Promise<ScClientCacheResponse | null> {
    return null;
  }

  async set(_key: string, _response: ScClientCacheResponse): Promise<void> {
    // no-op
  }
}

/** Shared null-cache instance for default DI. @public */
export const NULL_SC_CLIENT_CACHE = new NullScClientCache();
