import type { AtomsCatalog } from './types';
import {
  AtomCatalogActionEntry,
  AtomCatalogComponentEntry,
  SerializedCatalog,
} from '@sitecore-content-sdk/content/atoms';

/**
 * Serialize a json-render Catalog into the payload shape expected by Design Studio.
 * @param {AtomsCatalog} catalog - The Atoms catalog to serialize
 * @returns Serialized catalog for the Design Library event
 * @internal
 */
export function serializeCatalog(catalog: AtomsCatalog): SerializedCatalog {
  const { version, components, actions } = catalog.data;

  const serializedComponents: AtomCatalogComponentEntry[] = Object.entries(components).map(
    ([name, component]) => {
      const serializedComponent: AtomCatalogComponentEntry = {
        name,
        propsSchema: component.props.toJSONSchema(),
        description: component.description,
        slots: component.slots ?? ['default'],
        allowedChildren: component.allowedChildren,
        allowedParents: component.allowedParents,
        example: component.example,
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
      };

      if (action.params) serializedAction.paramsSchema = action.params.toJSONSchema();

      return serializedAction;
    }
  );

  const serializedCatalog: SerializedCatalog = {
    components: serializedComponents,
    actions: serializedActions,
  };

  if (version) serializedCatalog.version = version;

  return serializedCatalog;
}
