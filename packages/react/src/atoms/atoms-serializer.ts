import type { Catalog } from '@json-render/core';
import type { AtomsCatalogInput } from './types';

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
 * Serialize a json-render Catalog into the payload shape expected by Design Studio.
 * Extracts component names, JSON Schemas, descriptions, and slots.
 * @param { Catalog<any, AtomsCatalogInput> } catalog - The json-render Catalog to serialize
 * @returns Serialized catalog for the Design Library event
 * @internal
 */
export function serializeCatalog(catalog: Catalog<any, AtomsCatalogInput>): SerializedCatalog {
  const { version, components, actions } = catalog.data;
  const componentNames = Object.keys(components) as Array<keyof typeof components>;
  const actionNames = Object.keys(actions ?? {}) as Array<keyof typeof actions>;

  const serializedComponents = componentNames.map((name) => {
    const component = components[name];
    const serializedComponent: AtomCatalogComponentEntry = {
      name: name as string,
      propsSchema: component.props.toJSONSchema() as object,
      description: component.description,
      slots: component.slots ?? ['default'],
      allowedChildren: component.allowedChildren,
      allowedParents: component.allowedParents,
      example: component.example,
    };

    if (component.version) serializedComponent.version = component.version;

    return serializedComponent;
  });

  const serializedActions = actionNames.map((name) => {
    const action = actions![name];
    const serializedAction: AtomCatalogActionEntry = {
      name: name as string,
      description: action.description,
    };

    if (action.params) serializedAction.paramsSchema = action.params.toJSONSchema();

    return serializedAction;
  });

  const serializedCatalog: SerializedCatalog = {
    components: serializedComponents,
    actions: serializedActions,
  };

  if (version) serializedCatalog.version = version;

  return serializedCatalog;
}
