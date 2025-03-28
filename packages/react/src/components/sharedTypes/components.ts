import { ComponentType } from 'react';

/**
 * SXA uses custom default export name
 */
export const DEFAULT_EXPORT_NAME = 'Default';

/**
 * React component import with account for custom exports
 */
export type ReactJssComponent = ComponentType | ReactModule;

export type ReactModule = {
  /**
   * Custom exports
   */
  [key: string]: unknown;
  /**
   * Default module export
   */
  Default?: ComponentType;
  /**
   * Default non-standard export
   */
  default?: ComponentType;
} & {
  /**
   * Optional dynamic import for lazy components - allows component props retrieval
   */
  dynamicModule?: () => Promise<ReactJssComponent>;
};

/**
 * Component type returned from component builder / factory
 */
export type LazyComponentType = ComponentType & {
  // all elements created with nextjs dynamic() will have a separate render prop
  // react elements will not have it - so it's optional here
  render?: { [key: string]: unknown };
};

export type ComponentMap<TComponent extends ReactJssComponent = ReactJssComponent> = Map<
  string,
  TComponent
>;
