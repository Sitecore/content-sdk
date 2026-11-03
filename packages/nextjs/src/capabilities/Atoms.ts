import type { CapabilityFilter } from '@sitecore-content-sdk/core';
import { importsNamedExport, someSourceFile } from '@sitecore-content-sdk/core/node-tools';
import type * as NextjsExports from '../index';

// Type-checked against the package exports: renaming SitecoreProvider fails compilation here.
const SITECORE_PROVIDER_EXPORTS: ReadonlyArray<keyof typeof NextjsExports> = ['SitecoreProvider'];

// '@sitecore-content-sdk/nextjs' or '@sitecore-content-sdk/react', including subpaths.
const SDK_MODULE = /^@sitecore-content-sdk\/(?:nextjs|react)(?:\/.*)?$/;

/**
 * Tests whether source code wires atoms through SitecoreProvider.
 * @param {string} source source code
 * @returns {boolean} whether atomsConfig is passed to SitecoreProvider
 */
export const usesAtomsConfig = (source: string) =>
  importsNamedExport(source, SDK_MODULE, SITECORE_PROVIDER_EXPORTS) &&
  /\batomsConfig\b/.test(source);

/**
 * Passes when any application source file passes atomsConfig to SitecoreProvider.
 * @param {CapabilityFilterContext} context filter context
 * @returns {boolean} whether atomsConfig is wired
 */
export const hasAtomsConfig: CapabilityFilter = (context) =>
  someSourceFile(context, usesAtomsConfig);
