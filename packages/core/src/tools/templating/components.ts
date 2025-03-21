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
 * Describes a package and components to be imported
 */
export interface PackageDefinition {
  name: string;
  components: {
    moduleName: string;
    componentName: string;
  }[];
}

/**
 * Get list of components from @var paths
 * Returns a list of components in the following format:
 * {
 *  path: 'path/to/component',
 *  componentName: 'ComponentName',
 *  moduleName: 'ComponentName'
 * }
 * @param {string[]} paths path to search
 */
export function getComponentList(paths: string[]): ComponentFile[] {
  const components = paths.reduce((acc, path) => {
    acc.push(
      ...getItems<ComponentFile>({
        path,
        resolveItem: (path, name) => ({
          path: `${path}/${name}`,
          componentName: name,
          moduleName: name.replace(/[^\w]+/g, ''),
        }),
        cb: (name) => console.debug(`Registering JSS component ${name}`),
      })
    );
    return acc;
  }, [] as ComponentFile[]);

  return components;
}
