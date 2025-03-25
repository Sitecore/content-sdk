import { ComponentMap, JssComponentType } from '@sitecore-content-sdk/react';
import { Module, ModuleFactory } from '../sharedTypes/module-factory';
import { BaseComponent } from '@sitecore-content-sdk/react/types/components/sharedTypes';

/**
 * Represents a component that can be imported dynamically
 */
export type LazyModule = {
  module: () => Promise<Module>;
  element: (isEditing?: boolean) => JssComponentType;
};

/**
 * Component is a module or a nextjs lazy module
 */
export type NextjsComponent = BaseComponent | Module | LazyModule;

/**
 * Creates a new instance of module factory
 * Module factory provides a module (file) including all exports.
 * Module can be imported dynamically or statically.
 * @param {ComponentMap<NextjsComponent>} components - component map to extract factory from
 * @returns {ModuleFactory} Module factory implementation
 */
export const getModuleFactory = (components: ComponentMap<NextjsComponent>): ModuleFactory => {
  return (componentName: string) => {
    const component = components.get(componentName);

    if (!component) return null;

    // check if module should be imported dynamically
    if ((component as LazyModule).module) {
      return (component as LazyModule).module();
    }

    return component as Module;
  };
};
