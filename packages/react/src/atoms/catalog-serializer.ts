import type { AtomsCatalog } from './types';
import {
  AtomCatalogActionEntry,
  AtomCatalogComponentEntry,
  SerializedCatalog,
} from '@sitecore-content-sdk/content/atoms';

/**
 * Options for serializing an atoms catalog.
 * @internal
 */
export type SerializeCatalogOptions = {
  /**
   * How schemas without a JSON Schema equivalent (e.g. `z.date()`, `z.custom()`, transforms) are handled:
   * `'throw'` (default) throws, `'any'` serializes them as `{}`.
   */
  unrepresentable?: 'throw' | 'any';
};

/**
 * Serialize a json-render Catalog into the payload shape expected by Design Studio.
 * @param {AtomsCatalog} catalog - The Atoms catalog to serialize
 * @param {SerializeCatalogOptions} [options] - Serialization options
 * @returns Serialized catalog for the Design Library event
 * @internal
 */
export function serializeCatalog(
  catalog: AtomsCatalog,
  options?: SerializeCatalogOptions
): SerializedCatalog {
  const { version, stylingSolution, components, actions } = catalog.data;

  const serializedComponents: AtomCatalogComponentEntry[] = Object.entries(components).map(
    ([name, component]) => {
      const serializedComponent: AtomCatalogComponentEntry = {
        name,
        propsSchema: component.props.toJSONSchema(options),
        description: component.description,
        slots: component.slots ?? ['default'],
        allowedChildren: component.allowedChildren,
        allowedParents: component.allowedParents,
        example: component.example,
        // Defaulted at serialization: defaulting in the catalog would change every atom's hash.
        legacy: component.legacy ?? false,
      };

      if (component.version) serializedComponent.version = component.version;

      return serializedComponent;
    }
  );

  const serializedActions: AtomCatalogActionEntry[] = Object.entries(actions).map(
    ([name, action]) => {
      const serializedAction: AtomCatalogActionEntry = {
        name,
        description: action.description,
        // Defaulted at serialization: defaulting in the catalog would change every atom's hash.
        legacy: action.legacy ?? false,
      };

      if (action.params) serializedAction.paramsSchema = action.params.toJSONSchema(options);

      return serializedAction;
    }
  );

  const serializedCatalog: SerializedCatalog = {
    stylingSolution,
    components: serializedComponents,
    actions: serializedActions,
  };

  if (version) serializedCatalog.version = version;

  return serializedCatalog;
}
