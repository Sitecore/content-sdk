import { EDITING_PARAMS_HEADER } from '../editing/constants';

/**
 * Reads `process.env` when running under Node; otherwise returns an empty object.
 * process.env is only available on the server in Angular
 * @param {string} name - The name of the environment variable to read.
 * @returns {Record<string, string | undefined>} Environment map for merging into config.
 * @internal
 */
export function readProcessEnv(name: string) {
  // Use globalThis so we do not need @types/node (lib tsconfig uses "types": []).
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (env) {
    return env[name];
  }
  return undefined;
}

/**
 * A middleware path pattern: a `string` (matched exactly) or a `RegExp` (matched with `.test`).
 * @public
 */
export type PathPattern = string | RegExp;

/**
 * Matches a request path against a single pattern.
 * A `string` pattern is compared for exact equality; a `RegExp` pattern is tested against the path.
 * @param {string} path - The request path to test (query string already stripped).
 * @param {PathPattern} pattern - Exact string or regular expression.
 * @returns {boolean} True if the path matches the pattern.
 * @internal
 */
export function matches(path: string, pattern: PathPattern): boolean {
  return typeof pattern === 'string' ? path === pattern : pattern.test(path);
}

/**
 * Check if a request is in editing/preview mode, via the editing params header set by
 * {@link createEditingRenderMiddleware} on the render request.
 * @param {Record<string, string | string[] | undefined>} headers - Request headers
 * @returns {boolean} True if editing or preview mode is active
 * @internal
 */
export function isEditingPreview(
  headers: Record<string, string | string[] | undefined> = {}
): boolean {
  return !!headers[EDITING_PARAMS_HEADER];
}
