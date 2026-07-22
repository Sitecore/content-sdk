/** Default path to the App Router stylesheet used by starter templates. */
export const DEFAULT_ATOMS_CSS_FILE = 'src/app/globals.css';

/** Max entries for the in-memory compiled-CSS cache (per compiler instance). */
export const ATOMS_CSS_CACHE_MAX_ENTRIES = 200;

/**
 * Returns a stable cache key for a set of CSS class tokens.
 * @param {string[]} classes - Class tokens to key.
 * @returns {string} Sorted, space-joined key.
 * @internal
 */
export function atomsCssCacheKey(classes: string[]): string {
  return [...classes].sort().join(' ');
}

/**
 * Stores a value in a Map cache, evicting the oldest entry when over capacity.
 * @param {Map<string, string>} cache - Cache map.
 * @param {string} key - Cache key.
 * @param {string} value - Compiled CSS.
 * @param {number} [maxEntries] - Max size before eviction. Defaults to `ATOMS_CSS_CACHE_MAX_ENTRIES`.
 * @internal
 */
export function setAtomsCssCacheEntry(
  cache: Map<string, string>,
  key: string,
  value: string,
  maxEntries: number = ATOMS_CSS_CACHE_MAX_ENTRIES
): void {
  if (cache.size >= maxEntries) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
  cache.set(key, value);
}
