import { InjectionToken } from '@angular/core';
import type { ImportEntry } from '@sitecore-content-sdk/content/codegen';

/**
 * The Design Library import map: the shared `ImportEntry[]` registry (generated into
 * `.sitecore/import-map.ts`) used to resolve a generated component's imports at runtime.
 * @public
 */
export type DesignLibraryImportMap = ImportEntry[];

/**
 * Lazy provider for the Design Library import map
 * Returns the map directly or as a promise so apps can code-split it out of the
 * main bundle (the map is only needed in Design Library variant-generation mode).
 * @public
 */
export type DesignLibraryImportMapLoader = () =>
  | DesignLibraryImportMap
  | Promise<DesignLibraryImportMap>;

/**
 * Injection token supplying the Design Library import map to `sc-design-library`, either eagerly
 * (an `ImportEntry[]`) or lazily (a {@link DesignLibraryImportMapLoader}). Optional: apps may instead
 * bind the map via the component's `importMap` input.
 * @public
 */
export const DESIGN_LIBRARY_IMPORT_MAP = new InjectionToken<
  DesignLibraryImportMap | DesignLibraryImportMapLoader
>('DESIGN_LIBRARY_IMPORT_MAP');
