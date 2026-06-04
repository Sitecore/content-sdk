/**
 * Atoms runtime serialization — converts a Catalog to the payload shape
 * sent to Design Studio via the Design Library event.
 * @internal
 */
import type { Catalog } from '@json-render/core';
import type { AtomsCatalogInput } from './types';

/**
 * Serialized atom info for a single component, sent to Design Studio.
 * @public
 */
export interface AtomCatalogEntry {
  /** Component name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the component props. */
  propsSchema: object;
  /** Human-readable description. */
  description: string;
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
 * @public
 */
export interface ActionCatalogEntry {
  /** Action name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the action params. */
  paramsSchema: object;
  /** Human-readable description. */
  description: string;
}

/**
 * Full catalog payload sent to Design Studio.
 * @public
 */
export interface SerializedCatalog {
  /** Catalog root version from `defineAtomsCatalog`. Absent when not declared. */
  version?: string;
  /** Serialized component entries. */
  components: AtomCatalogEntry[];
  /** Serialized action entries. */
  actions: ActionCatalogEntry[];
}

/**
 * Serialize a json-render Catalog into the payload shape expected by Design Studio.
 * Extracts component names, JSON Schemas, descriptions, and slots.
 *
 * @param catalog - The json-render Catalog to serialize
 * @returns Serialized catalog for the Design Library event
 * @public
 */
export function serializeCatalog(catalog: Catalog<any, AtomsCatalogInput>): SerializedCatalog {
  const { version, components, actions } = catalog.data;
  const componentNames = Object.keys(components) as Array<keyof typeof components>;
  const actionNames = Object.keys(actions ?? {}) as Array<keyof typeof actions>;

  const serializedComponents = componentNames.map((name) => {
    const component = components[name];
    return {
      name: name as string,
      propsSchema: component.props.toJSONSchema() as object,
      description: component.description,
      slots: component.slots ?? ['default'],
      version: component.version,
      allowedChildren: component.allowedChildren,
      allowedParents: component.allowedParents,
      example: component.example,
    };
  });

  const serializedActions = actionNames.map((name) => {
    const action = actions![name];
    return {
      name: name as string,
      paramsSchema: action.params.toJSONSchema() as object,
      description: action.description,
    };
  });

  return { version, components: serializedComponents, actions: serializedActions };
}

