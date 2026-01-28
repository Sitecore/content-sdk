/**
 * Normalize a URL by removing the trailing slash
 * @param {string} url - The URL to normalize
 * @returns {string} The normalized URL
 * @public
 */
export const normalizeUrl = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);
