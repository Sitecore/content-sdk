/**
 * Stable cache / transfer-state key for loader data (browser `/_data` + `TransferState`).
 * @param {string} loaderId - Loader id
 * @param {string} locale - Resolved locale for this navigation
 * @param {string} canonicalUrl - Locale-stripped URL (may include query)
 * @returns {string} Key string
 * @public
 */
export function loaderDataCacheKey(
  loaderId: string,
  locale: string,
  canonicalUrl: string
): string {
  return `loader:${loaderId}:${locale}:${canonicalUrl}`;
}
