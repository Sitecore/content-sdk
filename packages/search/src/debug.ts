import { debugNamespace, debugModule, Debugger } from '@sitecore-content-sdk/core';

/**
 * Debugger for the search package
 * @public
 */
export const debug: Debugger = debugModule(`${debugNamespace}:search`);
