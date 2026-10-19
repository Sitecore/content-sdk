import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl, escapeRegExp } from '@sitecore-content-sdk/core/tools';
import { transformLayoutStrings } from './layout-walker';

/** Default Edge hostname derived from the default Edge URL (edge.sitecorecloud.io). @internal */
const DEFAULT_EDGE_HOSTNAME = new URL(constants.SITECORE_EXPERIENCE_EDGE_URL_DEFAULT).hostname;

/**
 * Returns true if the given URL has a custom (non-default) Edge hostname.
 * @param {string} url - Full URL or hostname
 * @returns {boolean} True if URL host is not the default Edge hostname
 * @internal
 */
function isCustomEdgeUrl(url: string): boolean {
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL(`https://${url}`);
    const host = u.hostname.toLowerCase();
    return host !== DEFAULT_EDGE_HOSTNAME;
  } catch {
    return false;
  }
}

/**
 * Regular expression for matching the default Edge hostname in URLs.
 * Matches both http:// and https:// protocols.
 * @internal
 */
const EDGE_HOST_PATTERN = new RegExp(`https?://${escapeRegExp(DEFAULT_EDGE_HOSTNAME)}`, 'gi');

/**
 * Rewrites Experience Edge hostnames in a response object to use the custom hostname.
 * This function performs a deep traversal of the object and replaces any string values
 * containing the default Experience Edge hostname with the custom hostname.
 * Caller should pass the Experience Edge URL (e.g. from resolveExperienceEdgeUrl()).
 *
 * Use case: Experience Edge returns Layout Service output (layout, placeholders, component fields).
 * Field values can contain URLs with the Edge hostname—e.g. Image field `value.src`
 * (`https://edge.sitecorecloud.io/-/media/...`), Rich Text HTML (`<img src="...">`),
 * or link `href`. When using a custom hostname (e.g. CDN in front of Edge), these URLs
 * must be rewritten so layout API and media requests both go through the custom host.
 * @param {T} response - The response object to process (typically LayoutServiceData)
 * @param {string} edgeUrl - Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl).
 * @returns {T} The response object with Experience Edge hostnames rewritten (same reference if no custom hostname)
 * @public
 * @example
 * const layout = await layoutService.fetchLayoutData(path, options);
 * const rewritten = rewriteEdgeHostInResponse(layout, resolveExperienceEdgeUrl());
 */
export function rewriteEdgeHostInResponse<T>(response: T, edgeUrl: string): T {
  const customEdgeUrl = normalizeUrl(edgeUrl);
  if (!isCustomEdgeUrl(customEdgeUrl)) {
    return response;
  }
  return transformLayoutStrings(response, (s) => rewriteEdgeHostInString(s, customEdgeUrl));
}

/**
 * Replaces Experience Edge hostnames in a string with the custom hostname.
 * @param {string} str - The string to process
 * @param {string} customEdgeUrl - The custom Experience Edge URL to replace with
 * @returns {string} The string with Experience Edge hostnames replaced
 * @internal
 */
function rewriteEdgeHostInString(str: string, customEdgeUrl: string): string {
  EDGE_HOST_PATTERN.lastIndex = 0;
  return str.replace(EDGE_HOST_PATTERN, customEdgeUrl);
}

/**
 * Returns the default media URL transformer: rewrites Experience Edge hostnames when custom hostname is configured.
 * @param {string} edgeUrl - Experience Edge URL to rewrite to (e.g. from resolveExperienceEdgeUrl()).
 * @returns {(value: string) => string} Transformer function; returns string unchanged when no custom hostname
 * @internal
 */
export function getDefaultMediaUrlTransformer(edgeUrl: string): (value: string) => string {
  const customEdgeUrl = normalizeUrl(edgeUrl);
  if (!isCustomEdgeUrl(customEdgeUrl)) {
    return (s) => s;
  }
  return (s) => rewriteEdgeHostInString(s, customEdgeUrl);
}

/**
 * Deeply traverses a value and applies a string transformer to every string.
 * @param {T} value - Value to process (layout, object, array, string)
 * @param {(s: string) => string} transform - Function that transforms each string
 * @returns {T} Transformed value; unchanged subtrees keep their original references
 * @internal
 */
export function applyMediaUrlRewrite<T>(value: T, transform: (s: string) => string): T {
  return transformLayoutStrings(value, (s) => transform(s));
}

/**
 * Checks if a string contains the default Edge hostname (from the default Edge URL).
 * @param {string} str - The string to check
 * @returns {boolean} True if the string contains the default Edge hostname
 * @public
 */
export function containsDefaultEdgeHost(str: string): boolean {
  return str.includes(DEFAULT_EDGE_HOSTNAME);
}
