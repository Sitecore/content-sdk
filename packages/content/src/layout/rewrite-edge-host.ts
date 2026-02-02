import { hasCustomEdgeHostname, resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';

/**
 * The default Edge Platform hostnames that may appear in responses.
 * These will be replaced with the custom hostname when configured.
 * @internal
 */
const DEFAULT_EDGE_HOSTNAMES = [
  'edge-platform.sitecorecloud.io',
  'edge.sitecorecloud.io', // Legacy hostname included for safety replacement
];

/**
 * Regular expression patterns for matching Edge hostnames in URLs.
 * Matches both http:// and https:// protocols.
 * @internal
 */
const EDGE_HOST_PATTERNS = DEFAULT_EDGE_HOSTNAMES.map(
  (hostname) => new RegExp(`https?://${hostname.replace(/\./g, '\\.')}`, 'gi')
);

/**
 * Rewrites Edge Platform hostnames in a response object to use the custom hostname.
 * This function performs a deep traversal of the object and replaces any string values
 * containing the default Edge hostnames with the custom hostname.
 *
 * Only performs rewriting when a custom Edge hostname is configured via environment variables.
 *
 * @param {T} response - The response object to process (typically LayoutServiceData)
 * @returns {T} The response object with Edge hostnames rewritten (same reference if no custom hostname)
 * @public
 *
 * @example
 * const layout = await layoutService.fetchLayoutData(path, options);
 * const rewritten = rewriteEdgeHostInResponse(layout);
 */
export function rewriteEdgeHostInResponse<T>(response: T): T {
  // Skip if no custom hostname is configured
  if (!hasCustomEdgeHostname()) {
    return response;
  }

  const customEdgeUrl = resolveEdgeUrl();

  return deepRewriteEdgeHost(response, customEdgeUrl);
}

/**
 * Recursively traverses an object/array and rewrites Edge hostnames in string values.
 *
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
 * Replaces Edge Platform hostnames in a string with the custom hostname.
 *
 * @param {string} str - The string to process
 * @param {string} customEdgeUrl - The custom Edge URL to replace with
 * @returns {string} The string with Edge hostnames replaced
 * @internal
 */
function rewriteEdgeHostInString(str: string, customEdgeUrl: string): string {
  let result = str;

  for (const pattern of EDGE_HOST_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    result = result.replace(pattern, customEdgeUrl);
  }

  return result;
}

/**
 * Checks if a string contains any default Edge Platform hostnames.
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if the string contains a default Edge hostname
 * @public
 */
export function containsDefaultEdgeHost(str: string): boolean {
  return DEFAULT_EDGE_HOSTNAMES.some((hostname) => str.includes(hostname));
}
