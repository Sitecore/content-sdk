import type { CapabilityFilter } from '@sitecore-content-sdk/core';
import { importsNamedExport, someSourceFile } from '@sitecore-content-sdk/core/node-tools';
import type * as NextjsExports from '../index';

// Type-checked against the package exports: renaming a component fails compilation here.
const DESIGN_LIBRARY_EXPORTS: ReadonlyArray<keyof typeof NextjsExports> = [
  'DesignLibrary',
  'DesignLibraryApp',
];

// '@sitecore-content-sdk/nextjs' or '@sitecore-content-sdk/react', including subpaths.
const SDK_MODULE = /^@sitecore-content-sdk\/(?:nextjs|react)(?:\/.*)?$/;

/**
 * Tests whether source code imports a Design Library component from the Next.js or React SDK.
 * @param {string} source source code
 * @returns {boolean} whether a Design Library component is imported
 */
export const importsDesignLibrary = (source: string) =>
  importsNamedExport(source, SDK_MODULE, DESIGN_LIBRARY_EXPORTS);

/**
 * Passes when any application source file imports a Design Library component.
 * @param {CapabilityFilterContext} context filter context
 * @returns {boolean} whether a Design Library component is imported
 */
export const hasDesignLibrary: CapabilityFilter = (context) =>
  someSourceFile(context, importsDesignLibrary);
