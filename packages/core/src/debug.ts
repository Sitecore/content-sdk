/* eslint-disable import/no-anonymous-default-export */
import debug from 'debug';
import isServer from './tools/is-server';

/**
 * Debug module
 * @public
 */
export const debugModule = debug;

/**
 * Debug namespace
 * @public
 */
export const debugNamespace = 'content-sdk';

/**
 * Debugger type
 * @public
 */
export type Debugger = debug.Debugger;

// On server/node side, allow switching from the built-in
// `%o` (pretty-print single line) and `%O` (pretty-print multiple line)
// with a `DEBUG_MULTILINE` environment variable.
if (
  isServer() &&
  process?.env?.DEBUG_MULTILINE === 'true' &&
  debug.formatters.o &&
  debug.formatters.O
) {
  debug.formatters.o = debug.formatters.O;
}

/**
 * Enable debug logging dynamically
 * @param {string} namespaces space-separated list of namespaces to enable
 * @public
 */
export const enableDebug = (namespaces: string) => debug.enable(namespaces);

/**
 * Check if a debug namespace is enabled
 * @param {string} namespace the namespace to check
 * @returns {boolean} whether the namespace is enabled
 * @public
 */
export function isNamespaceEnabled(namespace: string): boolean {
  return debug.enabled(namespace);
}

/**
 * Converts headers from various formats into a uniform key-value pair object.
 * @param {HeadersInit} incomingHeaders Incoming headers such as a Headers instance or plain object.
 * @returns {Record<string, string | string[]>} Normalized headers as key-value pairs.
 */
function normalizeHeaders(incomingHeaders: HeadersInit = {}) {
  const headers: Record<string, string | string[]> = {};

  if (typeof incomingHeaders.forEach === 'function')
    incomingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  else
    Object.entries(incomingHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });

  return headers;
}

/**
 * Interface for supporting the debug object.
 * @internal
 */
export interface DebugResponse {
  headers?: {
    [key: string]: string | string[] | [string, string][] | Record<string, string> | Headers;
  };
  redirected?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
  body?: unknown;
}

/**
 * Extracts debug information from an HTTP response if debugging is enabled.
 * @param {Response} response - The HTTP response object from fetch.
 * @returns {object} An object containing selected response details for debugging purposes.
 * @internal
 */
export function processDebugResponse(response: Response): DebugResponse {
  return {
    headers: normalizeHeaders(response.headers),
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
  };
}

/**
 * Default Sitecore Content SDK 'debug' module debuggers. Uses namespace prefix 'content-sdk:'.
 * See {@link https://www.npmjs.com/package/debug} for details.
 */
export default {
  common: debug(`${debugNamespace}:common`),
  http: debug(`${debugNamespace}:http`),
  init: debug(`${debugNamespace}:init`),
};
