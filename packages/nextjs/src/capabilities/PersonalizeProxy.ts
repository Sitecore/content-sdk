import type { CapabilityFilter } from '@sitecore-content-sdk/core';
import { importsNamedExport, someSourceFile } from '@sitecore-content-sdk/core/node-tools';
import type * as ProxyExports from '../proxy';

const PROXY_MODULE = /^@sitecore-content-sdk\/nextjs\/proxy$/;

// Type-checked against the package exports: renaming the proxy fails compilation here.
const PERSONALIZE_PROXY_EXPORTS: ReadonlyArray<keyof typeof ProxyExports> = ['PersonalizeProxy'];

/**
 * Tests whether source code imports the personalize proxy.
 * @param {string} source source code
 * @returns {boolean} whether the personalize proxy is imported
 */
export const importsPersonalizeProxy = (source: string) =>
  importsNamedExport(source, PROXY_MODULE, PERSONALIZE_PROXY_EXPORTS);

/**
 * Passes when any application source file imports the personalize proxy.
 * @param {CapabilityFilterContext} context filter context
 * @returns {boolean} whether the personalize proxy is imported
 */
export const hasPersonalizeProxy: CapabilityFilter = (context) =>
  someSourceFile(context, importsPersonalizeProxy);
