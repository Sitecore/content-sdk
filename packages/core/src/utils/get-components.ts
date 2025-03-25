import { ComponentRendering } from '../layout/models';

/**
 * @param {string} componentName component to be imported from the component factory
 * @param {string?} exportName component to be imported in case you export multiple components from the same file
 */
export type ComponentMap<T = BaseComponentModule> = Map<string, BaseComponentModule>;

export type BaseComponentModule<TComponent = unknown> = {
  /**
   * Custom exports
   */
  [key: string]: TComponent;
} & {
  /**
   * Default module export
   */
  Default?: TComponent;
  /**
   * Default non-standard export
   */
  default?: TComponent;
};

/**
 * SXA uses custom default export name
 */
export const DEFAULT_EXPORT_NAME = 'Default';

export const getComponentForRendering = <ComponentType>(
  renderingDefinition: ComponentRendering,
  componentMap: ComponentMap
): ComponentType | null => {
  if (!componentMap || componentMap.size === 0) {
    console.warn(
      `No componentFactory was available to service request for component ${renderingDefinition}`
    );
    return null;
  }

  // Render SXA Rendering Variant if available
  const exportName = renderingDefinition.params?.FieldNames;

  const component = componentMap.get(renderingDefinition.componentName);

  if (!component) return null;

  if (exportName && exportName !== DEFAULT_EXPORT_NAME) {
    return (component as BaseComponentModule)[exportName] as ComponentType;
  }

  return ((component as BaseComponentModule).Default ||
    (component as BaseComponentModule).default ||
    (component as ComponentType)) as ComponentType;
};
