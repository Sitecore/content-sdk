import { PREVIEW_KEY } from '@sitecore-content-sdk/content/editing';

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
 * Check if a request is in editing/preview mode.
 * @param {Record<string, string | undefined>} cookies - Request cookies
 * @returns {boolean} True if editing or preview mode is active
 * @internal
 */
export function isEditingPreview(cookies: Record<string, string | undefined> = {}): boolean {
  return !!cookies[PREVIEW_KEY];
}
