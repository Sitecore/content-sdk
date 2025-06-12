import { getItems } from './utils';

/**
 * Describes a file that represents a component definition
 */
export interface ComponentFile {
  path: string;
  moduleName: string;
  componentName: string;
}

/**
 * Definition for custom components to be included in component map.
 * Use this to define components imported from modules/dependencies/packages
 * @typedef PackageImport
 * @property {string} importName - Name of the import.
 * @property {object} importInfo - Information about how to import the package.
 * @property {string} importInfo.importFrom - The path from which to import the component(s).
 * @property {string[]} [importInfo.namedImports] - The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component.
 */
export interface PackageImport {
  importName: string;
  importInfo: {
    importFrom: string;
    namedImports?: string[];
  };
}

/**
 * Get list of components from @var path
 * Returns a list of components in the following format:
 * {
 *  path: 'path/to/component',
 *  componentName: 'ComponentName',
 *  moduleName: 'ComponentName'
 * }
 * @param {string} path path to search
 * @param {string[]} [exclude] paths and patterns to exclude from final result
 */
export function getComponentList(path: string, exclude?: string[]): ComponentFile[] {
  const components = getItems<ComponentFile>({
    path,
    exclude,
    resolveItem: (path, name) => ({
      path: `${path}/${name}`,
      componentName: name,
      moduleName: name.replace(/[^\w]+/g, ''),
    }),
    cb: (name) => console.debug(`Registering Content SDK component ${name}`),
  });

  return components;
}
