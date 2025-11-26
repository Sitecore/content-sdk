/* eslint-disable import/no-anonymous-default-export */
import debug from 'debug';
import isServer from './utils/is-server';

export const rootNamespace = 'content-sdk';

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
  search: debug(`${rootNamespace}:search`),
  common: debug(`${rootNamespace}:common`),
  form: debug(`${rootNamespace}:form`),
  http: debug(`${rootNamespace}:http`),
  layout: debug(`${rootNamespace}:layout`),
  dictionary: debug(`${rootNamespace}:dictionary`),
  editing: debug(`${rootNamespace}:editing`),
  sitemap: debug(`${rootNamespace}:sitemap`),
  multisite: debug(`${rootNamespace}:multisite`),
  robots: debug(`${rootNamespace}:robots`),
  redirects: debug(`${rootNamespace}:redirects`),
  personalize: debug(`${rootNamespace}:personalize`),
  locale: debug(`${rootNamespace}:locale`),
  errorpages: debug(`${rootNamespace}:errorpages`),
  proxy: debug(`${rootNamespace}:proxy`),
};
