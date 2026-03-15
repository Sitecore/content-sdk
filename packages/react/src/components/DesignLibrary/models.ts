import { ComponentFields, ComponentParams } from '@sitecore-content-sdk/content/layout';
import { ImportEntry } from '@sitecore-content-sdk/content/codegen';

/**
 * Model representing a dynamically generated component in the Design Library.
 * This model includes the component's fields and parameters, which are used for rendering and interaction within the Design Library.
 * @internal
 */
export type DynamicComponent = React.ComponentType<{
  [key: string]: unknown;
  fields?: ComponentFields;
  params?: ComponentParams;
}>;

/**
 * Model representing the import map in the Design Library.
 * @internal
 */
export type ImportMapImport = {
  default: ImportEntry[];
};
