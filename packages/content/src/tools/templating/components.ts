import * as glob from 'glob';
import {
  buildVariantSiblingIndex,
  ComponentFile,
  isVariantComponent,
  toPascalCase,
} from './component-builder';

/**
 * @public
 */
export let getComponentList = _getComponentList;

export const componentUnitMocks = {
  set getComponentList(mockImplementation) {
    getComponentList = mockImplementation;
  },
  get getComponentList() {
    return _getComponentList;
  },
};

const componentNamePattern = /^[\/]*(.+[\/\\])*(.+)\.[jt]sx?$/;

const componentPathPattern = /^([\/]*.+[\/\\].+)\..+$/;

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
 * @param {boolean} [includeVariants] whether to include variant components
 */
function _getComponentList(
  paths: string[],
  exclude?: string[],
  includeVariants?: boolean
): ComponentFile[] {
  const components = paths.reduce<ComponentFile[]>((result, path) => {
    const globPath =
      glob.hasMagic(path, { magicalBraces: true }) || path.match(componentNamePattern)
        ? path
        : path.replace(/\/$/, '').concat('/**/*.{js,jsx,ts,tsx}');
    return result.concat(
      ...glob
        .sync(globPath, { ignore: exclude, nodir: true })
        .filter((path: string) => path.match(componentNamePattern))
        .map((filePath: string) => {
          const name = filePath.match(componentNamePattern)![2];
          return {
            filePath,
            importPath: filePath.match(componentPathPattern)![1].replace(/\\/g, '/'), // use forward slashes for consistency
            // TODO: enabled using `toPascalCase()` for the two lines below with NextJS CSDK major release
            componentName: name,
            moduleName: toPascalCase(name).replace(/[^\w]+/g, ''),
          };
        })
    );
  }, []);

  if (includeVariants) return components;
  // Drop variant files that have a base (non-variant) sibling at the same import-path root.
  const siblingIndex = buildVariantSiblingIndex(
    components.map((c) => ({ componentName: c.componentName, importPathNoExt: c.importPath }))
  );
  return components.filter(
    (component) => !isVariantComponent(component.componentName, component.importPath, siblingIndex)
  );
}
