import { Spec } from '@json-render/core';

/**
 * Serialized atom info for a single component, sent to Design Studio.
 * @internal
 */
export interface AtomCatalogComponentEntry {
  /** Component name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the component props. */
  propsSchema: object;
  /** Human-readable description. */
  description?: string;
  /** Named slots (children). */
  slots: string[];
  /** Semver version of this component definition. */
  version?: string;
  /** Component names that are allowed as children in this component's slots. */
  allowedChildren?: string[];
  /** Component names that this component is allowed to be placed inside. */
  allowedParents?: string[];
  /** Example prop values for AI prompt generation. Auto-generated from Zod schema if omitted. */
  example?: unknown;
}

/**
 * Serialized action info, sent to Design Studio.
 * @internal
 */
export interface AtomCatalogActionEntry {
  /** Action name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the action params. */
  paramsSchema?: object;
  /** Human-readable description. */
  description: string | undefined;
}

/**
 * Full catalog payload sent to Design Studio.
 * @internal
 */
export interface SerializedCatalog {
  /** Catalog root version from `defineAtomsCatalog`. Absent when not declared. */
  version?: string;
  /** Serialized component entries. */
  components: AtomCatalogComponentEntry[];
  /** Serialized action entries. */
  actions: AtomCatalogActionEntry[];
}

/**
 * Sitecore-specific placement metadata added to a component definition.
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

export interface Document extends Spec {
  /** Human-readable identifier of the document. */
  name: string;
}

