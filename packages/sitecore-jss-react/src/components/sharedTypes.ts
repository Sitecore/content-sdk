import { ComponentType } from 'react';

/**
 * @param {string} componentName component to be imported from the component factory
 * @param {string?} exportName component to be imported in case you export multiple components from the same file
 */
export type ComponentFactory = (
  componentName: string,
  exportName?: string
) => JssComponentType | null;

/**
 * Component type returned from component builder / factory
 */
export type JssComponentType = ComponentType & {
  // all elements created with nextjs dynamic() will have a separate render prop
  // react elements will not have it - so it's optional here
  render?: { [key: string]: unknown };
};

/**
 * Shared editing field props
 */
export interface EditableFieldProps {
  /**
   * Can be used to explicitly disable inline editing.
   * @default true
   */
  editable?: boolean;
  /**
   * Custom element to render in Pages in edit mode if field value is empty
   */
  emptyFieldEditingComponent?: React.ComponentClass<unknown> | React.FC<unknown>;
}
