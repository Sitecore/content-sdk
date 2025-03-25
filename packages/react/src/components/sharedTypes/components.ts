import { ComponentType } from 'react';

/**
 * SXA uses custom default export name
 */
export const DEFAULT_EXPORT_NAME = 'Default';

export type ReactJssModule = {
  /**
   * Custom exports
   */
  [key: string]: ComponentType;
  /**
   * Default module export
   */
  Default?: ComponentType;
  /**
   * Default non-standard export
   */
  default?: ComponentType;
};

/**
 * Component type returned from component builder / factory
 */
export type ExtendedComponentType = ComponentType & {
  // all elements created with nextjs dynamic() will have a separate render prop
  // react elements will not have it - so it's optional here
  render?: { [key: string]: unknown };
};

export type ReactJssComponent<TModule extends ReactJssModule = ReactJssModule> =
  | TModule
  | ExtendedComponentType;

export type ComponentMap<TComponent extends ReactJssComponent = ReactJssComponent> = Map<
  string,
  TComponent
>;
