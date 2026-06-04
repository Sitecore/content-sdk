/** Atoms module — json-render based runtime. */
export type {
  AtomComponentDefinition,
  AtomActionDefinition,
  AtomsCatalogInput,
  SitecoreComponentMeta,
  AtomsComponentsMap,
  AtomActionHandler,
  AtomsActionsMap,
  AtomsRegistryOptions,
  AtomsConfig,
  AtomsSpec,
  AtomRenderProps,
} from './types';
export { defineAtomsCatalog } from './define-atoms-catalog';
export { defineAtomsRegistry } from './define-atoms-registry';
export { serializeCatalog } from './atoms-serializer';
export type { AtomCatalogEntry, ActionCatalogEntry, SerializedCatalog } from './atoms-serializer';
export {
  withPropMeta,
  withArgMeta,
  getFieldMeta,
  type PropMeta,
  type ArgMeta,
} from './schema-utils';
export {
  textFieldSchema,
  richTextFieldSchema,
  dateFieldSchema,
  linkFieldSchema,
  imageFieldSchema,
  fileFieldSchema,
  type TextFieldSchema,
  type RichTextFieldSchema,
  type DateFieldSchema,
  type LinkFieldSchema,
  type ImageFieldSchema,
  type FileFieldSchema,
} from './field-schemas';
