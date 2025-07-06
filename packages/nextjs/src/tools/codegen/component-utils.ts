import * as glob from 'glob';

const componentNamePattern = /^[\/]*(.+[\/\\])*(.+)\.[jt]sx?$/;

const componentPathPattern = /^([\/]*.+[\/\\].+)\..+$/;

// TODO: use imports from core after beta-dev sync

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
 * @typedef ComponentImport
 * @property {string} importName - Name of the import.
 * @property {object} importInfo - Information about how to import the package.
 * @property {string} importInfo.importFrom - The path from which to import the component(s).
 * @property {string[]} [importInfo.namedImports] - The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component.
 */
export interface ComponentImport {
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
 * @param {string[]} paths paths to search
 * @param {string[]} [exclude] paths and glob patterns to exclude from final result
 */
export function getFilesList(paths: string[], exclude?: string[]) {
  const components = paths.reduce<string[]>((result, path) => {
    const globPath =
      glob.hasMagic(path, { magicalBraces: true }) || path.match(componentNamePattern)
        ? path
        : path.replace(/\/$/, '').concat('/**/*.{js,jsx,ts,tsx}');
    return result.concat(
      ...glob
        .sync(globPath, { ignore: exclude, nodir: true })
        .filter((path) => path.match(componentNamePattern))
    );
  }, []);

  return components;
}