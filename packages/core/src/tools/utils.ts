import { ClientError } from 'graphql-request';
import { IncomingHttpHeaders } from 'http';
import { ParsedUrlQueryInput } from 'querystring';
import isServer from './is-server';

/**
 * Omit properties from T that are in K. This is a simplified version of TypeScript's built-in `Omit` utility type.
 * Since default `Omit` doesn't support indexing types, we had to introduce this custom implementation.
 * @public
 */
// eslint-disable-next-line prettier/prettier
export type EnhancedOmit<T, K extends PropertyKey> = { [P in keyof T as Exclude<P, K>]: T[P] };

/**
 * note: encodeURIComponent is available via browser (window) or natively in node.js
 * if you use another js engine for server-side rendering you may not have native encodeURIComponent
 * and would then need to install a package for that functionality
 * @param {ParsedUrlQueryInput} params query string parameters
 * @returns {string} query string
 */
function getQueryString(params: ParsedUrlQueryInput) {
  return Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`)
    .join('&');
}

/**
 * Resolves a base URL that may contain query string parameters and an additional set of query
 * string parameters into a unified string representation.
 * @param {string} urlBase the base URL that may contain query string parameters
 * @param {ParsedUrlQueryInput} params query string parameters
 * @returns a URL string
 * @throws {RangeError} if the provided url is an empty string
 * @public
 */
export function resolveUrl(urlBase: string, params: ParsedUrlQueryInput = {}): string {
  if (!urlBase) {
    throw new RangeError('url must be a non-empty string');
  }

  // This is a better way to work with URLs since it handles different user input
  // edge cases. This works in Node and all browser except IE11.
  // https://developer.mozilla.org/en-US/docs/Web/API/URL
  if (isServer()) {
    const url = new URL(urlBase);
    for (const key in params) {
      if ({}.hasOwnProperty.call(params, key)) {
        url.searchParams.append(key, String(params[key]));
      }
    }
    const result = url.toString();
    return result;
  }

  const qs = getQueryString(params);
  const result = urlBase.indexOf('?') !== -1 ? `${urlBase}&${qs}` : `${urlBase}?${qs}`;
  return result;
}

/**
 * Indicates whether the error is a timeout error
 * @param {unknown} error error
 * @returns {boolean} is timeout error
 * @public
 */
export const isTimeoutError = (error: unknown) => {
  return (error as ClientError).response?.status === 408 || (error as Error).name === 'AbortError';
};

/**
 * Converts a string value in a regex pattern allowing wildcard matching
 * @param {string} pattern input with wildcards i.e. site.*.com
 * @returns {string} modified string that can be used as regexp input
 */
const convertToWildcardRegex = (pattern: string) => {
  return '^' + pattern.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
};

/**
 * Gets allowed origins from JSS_ALLOWED_ORIGINS env variable
 * @returns {string[]} list of allowed origins from JSS_ALLOWED_ORIGINS env variable
 * @public
 */
export const getAllowedOriginsFromEnv = () =>
  process.env.JSS_ALLOWED_ORIGINS
    ? process.env.JSS_ALLOWED_ORIGINS.replace(' ', '').split(',')
    : [];

/**
 * Gets enforced CORS headers
 * @param {object} options - The options
 * @param {string} options.requestMethod - The HTTP method of the request.
 * @param {IncomingHttpHeaders | Headers} options.headers - The headers of the request.
 * @param {string | string[]} options.presetCorsHeader - The preset CORS header.
 * @param {string[]} [options.allowedOrigins] - The allowed origins.
 * @returns {Record<string, string>} - The enforced CORS headers.
 * @public
 */
export const getEnforcedCorsHeaders = ({
  requestMethod,
  headers,
  presetCorsHeader,
  allowedOrigins = [],
}: {
  requestMethod: string | undefined;
  headers: IncomingHttpHeaders | Headers;
  presetCorsHeader?: string | string[];
  allowedOrigins?: string[];
}) => {
  // ugly but gotta satisfy both node.js and web fetch Headers interface somehow
  const origin = (headers as Headers).get
    ? (headers as Headers).get('origin')
    : (headers as IncomingHttpHeaders).origin;
  if (!origin) {
    return {};
  }
  // 3 sources of allowed origins are considered:
  // the env value
  const defaultAllowedOrigins = getAllowedOriginsFromEnv();
  // the allowedOrigins prop
  allowedOrigins = defaultAllowedOrigins.concat(allowedOrigins || []);
  // and the existing CORS header, if provided (i.e. from nextjs config)
  if (presetCorsHeader) {
    allowedOrigins.push(presetCorsHeader as string);
  }

  if (
    origin &&
    allowedOrigins.some(
      (allowedOrigin) =>
        origin === allowedOrigin || new RegExp(convertToWildcardRegex(allowedOrigin)).test(origin)
    )
  ) {
    const corsHeaders: { [key: string]: string } = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT, PATCH',
      'x-middleware-cache': 'no-cache',
      'Cache-Control': 'no-store, must-revalidate',
    };
    // set the allowed headers for preflight requests
    if (requestMethod === 'OPTIONS') {
      corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    return corsHeaders;
  }
  return null;
};

/**
 * Determines whether the given input is a regular expression or resembles a URL.
 * @param {string} input - The input string to evaluate.
 * @returns {'regex' | 'url'} - Returns 'url' if the input looks like a URL, otherwise 'regex'.
 * @public
 */
export const isRegexOrUrl = (input: string): 'regex' | 'url' => {
  // Remove the trailing slash.
  input = input.slice(0, -1);

  // Check if the string resembles a URL.
  const isUrlLike =
    /^\/[a-zA-Z0-9\-\/]+(\?([a-zA-Z0-9\-_]+=[a-zA-Z0-9\-_]+)(&[a-zA-Z0-9\-_]+=[a-zA-Z0-9\-_]+)*)?$/.test(
      input
    );

  if (isUrlLike) {
    return 'url';
  }

  // If it doesn't resemble a URL, it's likely a regular expression.
  return 'regex';
};

/**
 * Compares two URLSearchParams objects to determine if they are equal.
 * @param {URLSearchParams} params1 - The first set of URL search parameters.
 * @param {URLSearchParams} params2 - The second set of URL search parameters.
 * @returns {boolean} - Returns true if the parameters are equal, otherwise false.
 * @public
 */
export const areURLSearchParamsEqual = (
  params1: URLSearchParams,
  params2: URLSearchParams
): boolean => {
  // Generates a sorted string representation of URL search parameters.
  const getSortedParamsString = (params: URLSearchParams): string => {
    return [...params.entries()]
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  };

  // Compare the sorted strings of both parameter sets.
  return getSortedParamsString(params1) === getSortedParamsString(params2);
};

/**
 * Escapes non-special "?" characters in a string or regex.
 * - For regex patterns that start with `^` or end with `$`, it returns the pattern unchanged.
 * - For other strings, it escapes literal "?" characters but preserves regex quantifiers and special patterns.
 * @param {string} input - The input string or regex pattern.
 * @returns {string} - The modified string or regex with non-special "?" characters escaped.
 * @public
 */
export const escapeNonSpecialQuestionMarks = (input: string): string => {
  // If the input is already a regex pattern (starts with ^ or ends with $), return it unchanged
  if (input.startsWith('^') || input.endsWith('$')) {
    return input;
  }

  // For non-regex strings, escape literal "?" characters
  return input.replace(/\?/g, '\\?');
};

/**
 * Escapes a string so it can be safely embedded in a RegExp as a literal.
 * @param {string} input - The string to escape
 * @returns {string} The escaped string safe for RegExp construction
 * @internal
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Merges two URLSearchParams objects. If both objects contain the same key, the value from the second object overrides the first.
 * @param {URLSearchParams} params1 - The first set of URL search parameters.
 * @param {URLSearchParams} params2 - The second set of URL search parameters.
 * @returns {string} - A string representation of the merged URL search parameters.
 * @public
 */
export const mergeURLSearchParams = (
  params1: URLSearchParams,
  params2: URLSearchParams
): string => {
  const merged = new URLSearchParams();

  // Add all keys and values from the first object.
  for (const [key, value] of params1.entries()) {
    merged.set(key, value);
  }

  // Add all keys and values from the second object, replacing existing ones.
  for (const [key, value] of params2.entries()) {
    merged.set(key, value);
  }

  return merged.toString();
};
