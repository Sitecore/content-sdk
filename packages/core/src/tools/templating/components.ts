import * as glob from 'glob';
import * as fs from 'fs';

const componentNamePattern = /^[\/]*(.+[\/\\])*(.+)\.[jt]sx?$/;

const componentPathPattern = /^([\/]*.+[\/\\].+)\..+$/;

export type ComponentType = 'server' | 'client' | 'universal';
export type RouterType = 'app' | 'pages';

/**
 * Describes a file that represents a component definition
 * @typedef ComponentFile
 * @property {string} filePath - Path to the component or code file
 * @property {string} importPath - Normalized path that can be used for import statements
 * @property {string} moduleName - Normalized name that can be used as import
 * @property {string} componentName - Name of the code file
 */
export interface ComponentFile {
  filePath: string;
  importPath: string;
  moduleName: string;
  componentName: string;
  componentType?: ComponentType;
}

export interface ComponentFileWithType extends ComponentFile {
  componentType: ComponentType;
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
export function getComponentList(paths: string[], exclude?: string[]): ComponentFile[] {
  const components = paths.reduce<ComponentFile[]>((result, path) => {
    const globPath =
      glob.hasMagic(path, { magicalBraces: true }) || path.match(componentNamePattern)
        ? path
        : path.replace(/\/$/, '').concat('/**/*.{js,jsx,ts,tsx}');
    return result.concat(
      ...glob
        .sync(globPath, { ignore: exclude, nodir: true })
        .filter((path) => path.match(componentNamePattern))
        .map((filePath) => {
          const name = filePath.match(componentNamePattern)![2];
          console.debug(`Registering Content SDK component ${name}`);
          return {
            filePath,
            importPath: filePath.match(componentPathPattern)![1].replace(/\\/g, '/'), // use forward slashes for consistency
            componentName: name,
            moduleName: name.replace(/[^\w]+/g, ''),
          };
        })
    );
  }, []);

  return components;
}

export function detectRouterType(projectRoot: string = process.cwd()): RouterType {
  const appDirExists =
    fs.existsSync(`${projectRoot}/src/app`) || fs.existsSync(`${projectRoot}/app`);
  const pagesDirExists =
    fs.existsSync(`${projectRoot}/src/pages`) || fs.existsSync(`${projectRoot}/pages`);

  if (appDirExists) {
    return 'app';
  }

  if (pagesDirExists) {
    return 'pages';
  }

  return 'pages';
}

export function detectComponentType(filePath: string): ComponentType {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for 'use client' directive
    if (content.includes("'use client'") || content.includes('"use client"')) {
      return 'client';
    }

    // Check for explicit componentType export
    const componentTypeMatch = content.match(
      /export\s+const\s+componentType\s*[:=]\s*['"`](\w+)['"`]/
    );
    if (componentTypeMatch) {
      const type = componentTypeMatch[1] as ComponentType;
      if (type === 'server' || type === 'client' || type === 'universal') {
        return type;
      }
    }

    // Default to universal if no explicit indicators
    return 'universal';
  } catch {
    return 'universal';
  }
}

export function getComponentListWithTypes(
  paths: string[],
  exclude?: string[]
): ComponentFileWithType[] {
  const components = getComponentList(paths, exclude);

  return components.map((component) => ({
    ...component,
    componentType: detectComponentType(component.filePath),
  }));
}

export function filterComponentsByType(
  components: ComponentFileWithType[],
  allowedTypes: ComponentType[]
): ComponentFileWithType[] {
  return components.filter((component) => allowedTypes.includes(component.componentType));
}
