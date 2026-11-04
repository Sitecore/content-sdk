import type { CapabilityFilter, CapabilityMetadataResolver } from '@sitecore-content-sdk/core';
import { ATOMS_CATALOG_METADATA_KEY } from '@sitecore-content-sdk/content/atoms';
import { type AtomsCatalog, serializeCatalog } from '@sitecore-content-sdk/react';
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

/**
 * Resolves atoms capability metadata from the catalog passed in `appInputs`.
 * Schemas without a JSON Schema equivalent (e.g. `z.date()`) are serialized as `{}` instead of throwing,
 * and an empty catalog is written when the catalog is missing or cannot be serialized,
 * so a broken catalog does not break metadata generation.
 * @param {CapabilityFilterContext} context filter context
 * @returns {CapabilityMetadata} atoms metadata with the serialized catalog
 */
export const getAtomsMetadata: CapabilityMetadataResolver = ({ appInputs }) => {
  const catalog = appInputs?.[ATOMS_CATALOG_METADATA_KEY] as AtomsCatalog | undefined;
  if (!catalog) {
    return { catalog: {} };
  }

  try {
    return { catalog: serializeCatalog(catalog, { unrepresentable: 'any' }) };
  } catch (error) {
    console.error('Failed to serialize the atoms catalog for application metadata.', error);
    return { catalog: {} };
  }
};
