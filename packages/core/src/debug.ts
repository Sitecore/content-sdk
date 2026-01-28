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
 * Default Sitecore Content SDK 'debug' module debuggers. Uses namespace prefix 'content-sdk:'.
 * See {@link https://www.npmjs.com/package/debug} for details.
 */
export default {
  common: debug(`${debugNamespace}:common`),
  http: debug(`${debugNamespace}:http`),
  init: debug(`${debugNamespace}:init`),
};
