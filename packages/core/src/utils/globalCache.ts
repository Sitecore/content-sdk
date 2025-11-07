export const DL_CACHE_NAMESPACE = '__dlCache';

/**
 * Stores a value in the global cache under the specified key.
 * - Initializes the cache object on `globalThis` if it does not exist.
 * - Overwrites any existing value for the given key.
 * @param {string} key - The cache key to set.
 * @param {unknown} data - The value to store in the cache.
 */
export function setCache(key: string, data: unknown): void {
  if (!(globalThis as any)[DL_CACHE_NAMESPACE]) {
    (globalThis as any)[DL_CACHE_NAMESPACE] = {};
  }
  (globalThis as any)[DL_CACHE_NAMESPACE][key] = data;
}

/**
 * Retrieves a value from the global cache by key.
 *  - The cache is stored on `globalThis`
 * @param {string} key - The cache key to retrieve and remove.
 * @returns {T} - The cached value if present, otherwise undefined.
 */
export function getCache<T>(key: string): T | undefined {
  const cache = (globalThis as any)[DL_CACHE_NAMESPACE];
  const data = cache?.[key];
  delete cache?.[key];
  return data;
}

/**
 * Retrieves a value from the global cache by key and removes it from the cache.
 *  - The cache is stored on `globalThis`
 * @param {string} key - The cache key to retrieve and remove.
 * @returns {T} - The cached value if present, otherwise undefined.
 */
export function getCacheAndClean<T>(key: string): T | undefined {
  const cache = (globalThis as any)[DL_CACHE_NAMESPACE];
  const data = cache?.[key];
  delete cache?.[key];
  return data as T;
}

/**
 * Determines whether a cached value exists for the provided key
 *  - The cache is stored on `globalThis`
 * @param {string} key - The cache key to test for existence.
 * @returns {boolean} - true if a value is present for the given key; otherwise false.
 */
export function hasCache(key: string): boolean {
  const cache = (globalThis as any)[DL_CACHE_NAMESPACE];
  return cache?.[key] !== undefined;
}
