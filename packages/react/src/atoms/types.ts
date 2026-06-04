/**
 * Atoms type definitions for the json-render based runtime.
 * @public
 */
import type { Catalog, InferCatalogInput, Spec } from '@json-render/core';
import type { ComponentRenderer, DefineRegistryResult, ReactSchema } from '@json-render/react';

// Private: json-render base catalog types derived from the React schema
type BaseCatalog = InferCatalogInput<ReactSchema['definition']['catalog']>;
type BaseComponent = BaseCatalog['components'][string];
type BaseAction = BaseCatalog['actions'][string];

/* ── Catalog input types ── */

/**
 * Sitecore-specific placement metadata added to a component definition.
 * These fields extend the json-render base component schema.
 * @public
 */
export interface SitecoreComponentMeta {
  /** Semver version of this component definition. */
  version?: string;
  /** Component names that are allowed as children in this component's slots. */
  allowedChildren?: string[];
  /** Component names that this component is allowed to be placed inside. */
  allowedParents?: string[];
}

/**
 * Component definition in the atoms catalog input.
 * Extends json-render's base component type with Sitecore-specific metadata.
 * @public
 */
export type AtomComponentDefinition = BaseComponent &
  SitecoreComponentMeta & {
    /** Human-readable description for AI generation and palette display. */
    description: string;
  };

/**
 * Action definition in the atoms catalog input.
 * Extends json-render's base action type with required params and description.
 * @public
 */
export type AtomActionDefinition = BaseAction & {
  /** Zod schema for action params. */
  params: NonNullable<BaseAction['params']>;
  /** Human-readable description of the action. */
  description: string;
};

/**
 * Input shape for defineAtomsCatalog.
 * Extends json-render's base catalog input with Sitecore-specific fields.
 * @public
 */
export type AtomsCatalogInput = BaseCatalog & {
  /** Semver version of the catalog as a whole. Used by the lock file and Design Studio. */
  version?: string;
  /** Component definitions keyed by name. */
  components: Record<string, AtomComponentDefinition>;
  /** Action definitions keyed by name (optional). */
  actions?: Record<string, AtomActionDefinition>;
};

/* ── Registry input types ── */

/**
 * Component implementations map for defineAtomsRegistry.
 * Maps component names to json-render ComponentRenderer functions.
 * @public
 */
export type AtomsComponentsMap = Record<string, ComponentRenderer>;

/**
 * Action handler function.
 * @public
 */
export type AtomActionHandler = (params: Record<string, unknown>) => Promise<void> | void;

/**
 * Action implementations map for defineAtomsRegistry.
 * @public
 */
export type AtomsActionsMap = Record<string, AtomActionHandler>;

/**
 * Options for defineAtomsRegistry.
 * @public
 */
export interface AtomsRegistryOptions {
  /** React component implementations mapped to catalog component names. */
  components: AtomsComponentsMap;
  /** Action handler implementations mapped to catalog action names. */
  actions?: AtomsActionsMap;
}

/* ── Runtime types ── */

/**
 * Props the developer passes to the provider for atoms support.
 * @public
 */
export interface AtomsConfig {
  /** The json-render catalog (schema + component/action definitions). */
  catalog: Catalog<any, AtomsCatalogInput>;
  /** The registry result returned by defineAtomsRegistry. */
  registry: DefineRegistryResult;
}

/**
 * Re-export Spec type from json-render for consumer convenience.
 * @public
 */
export type { Spec as AtomsSpec };

/**
 * Re-export ComponentRenderProps from json-render for consumer convenience.
 * @public
 */
export type { ComponentRenderProps as AtomRenderProps } from '@json-render/react';
