import type { CapabilityFilter } from '@sitecore-content-sdk/core';
import { importsNamedExport, someSourceFile } from './utils';

/**
 * Package exports that signal Design Library support.
 * The spec checks these against the package exports, so renaming one fails the build.
 * The check can't live here: the component pulls Angular client modules into the Node build.
 */
export const DESIGN_LIBRARY_EXPORTS = ['ScDesignLibraryComponent'] as const;

// '@sitecore-content-sdk/angular', including subpaths.
const SDK_MODULE = /^@sitecore-content-sdk\/angular(?:\/.*)?$/;

/**
 * Tests whether source code imports Design Library support from the Angular SDK.
 * @param {string} source source code
 * @returns {boolean} whether Design Library support is imported
 */
export const importsDesignLibrary = (source: string) =>
  importsNamedExport(source, SDK_MODULE, DESIGN_LIBRARY_EXPORTS);

/**
 * Passes when any application source file imports Design Library support.
 * @param {CapabilityFilterContext} context filter context
 * @returns {boolean} whether Design Library support is imported
 */
export const hasDesignLibrary: CapabilityFilter = (context) =>
  someSourceFile(context, importsDesignLibrary);
