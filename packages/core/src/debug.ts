/* eslint-disable import/no-anonymous-default-export */
import debug from 'debug';
import isServer from './utils/is-server';

/**
 * Debug namespace prefix
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
  search: debug(`${debugNamespace}:search`),
  common: debug(`${debugNamespace}:common`),
  form: debug(`${debugNamespace}:form`),
  http: debug(`${debugNamespace}:http`),
  layout: debug(`${debugNamespace}:layout`),
  dictionary: debug(`${debugNamespace}:dictionary`),
  editing: debug(`${debugNamespace}:editing`),
  sitemap: debug(`${debugNamespace}:sitemap`),
  multisite: debug(`${debugNamespace}:multisite`),
  robots: debug(`${debugNamespace}:robots`),
  redirects: debug(`${debugNamespace}:redirects`),
  personalize: debug(`${debugNamespace}:personalize`),
  locale: debug(`${debugNamespace}:locale`),
  errorpages: debug(`${debugNamespace}:errorpages`),
  proxy: debug(`${debugNamespace}:proxy`),
};
