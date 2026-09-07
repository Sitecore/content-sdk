import { enableDebug } from '@sitecore-content-sdk/core';

/**
 * Enables the debug scopes defined by the `DEBUG` environment variable.
 *
 * The 'debug' module only reads `DEBUG` when it is first imported, which happens before the CLI
 * loads `.env` files, so the scopes have to be enabled explicitly afterwards. This is done through
 * `@sitecore-content-sdk/core` to update the same 'debug' instance the SDK packages log through -
 * a bare `require('debug')` may resolve to a different copy of the module, in which case the
 * enabled scopes are never applied to the SDK debuggers.
 * @returns {string[]} the debug scopes which have been enabled
 */
export default function enableDebugLogging(): string[] {
  // scopes can be separated by commas or whitespace, matching how the 'debug' module parses them
  const scopes = (process.env.DEBUG || '').trim().split(/[\s,]+/).filter(Boolean);

  if (!scopes.length) {
    return [];
  }

  enableDebug(scopes.join(','));

  return scopes;
}
