import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';

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
 * Escapes a string so it can be safely embedded in a RegExp as a literal.
 * @param {string} input - The string to escape
 * @returns {string} The escaped string safe for RegExp construction
 * @internal
 */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
  return deepRewriteEdgeHost(response, customEdgeUrl);
}

/**
 * Recursively traverses an object/array and rewrites Edge hostnames in string values.
 * @param {T} value - The value to process
 * @param {string} customEdgeUrl - The custom Edge URL to replace with
 * @returns {T} The processed value with Edge hostnames replaced
 * @internal
 */
function deepRewriteEdgeHost<T>(value: T, customEdgeUrl: string): T {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle strings - perform the actual replacement
  if (typeof value === 'string') {
    return rewriteEdgeHostInString(value, customEdgeUrl) as T;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => deepRewriteEdgeHost(item, customEdgeUrl)) as T;
  }

  // Handle plain objects
  if (typeof value === 'object') {
    // Skip non-plain objects (Date, RegExp, etc.)
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return value;
    }

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = deepRewriteEdgeHost((value as Record<string, unknown>)[key], customEdgeUrl);
    }
    return result as T;
  }

  // Return primitives (numbers, booleans) unchanged
  return value;
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
 * @returns {T} New value with transformed strings
 * @internal
 */
export function applyMediaUrlRewrite<T>(value: T, transform: (s: string) => string): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    return transform(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => applyMediaUrlRewrite(item, transform)) as T;
  }
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = applyMediaUrlRewrite((value as Record<string, unknown>)[key], transform);
    }
    return result as T;
  }
  return value;
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
