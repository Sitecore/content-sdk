import * as glob from 'glob';

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
 * @internal
 */
export type ComponentType = 'server' | 'client' | 'universal';

/**
 * @internal
 */
export type RouterType = 'app' | 'pages';

/**
 * @internal
 */
export type ComponentMapTemplate = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports?: ComponentImport[]
) => string;

/**
 * @internal
 */
export type EnhancedComponentMapTemplate = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports: ComponentImport[] | undefined,
  ctx: {
    entries: ComponentMapEntry[];
    includeVariants?: boolean;
    isClientMap?: boolean;
  }
) => string;

/**
 * An entry in the component map, including import lines and value expression.
 * @internal
 */
export type ComponentMapEntry = {
  /** map entry key */
  key: string;
  /** namespace import lines needed for this entry */
  imports: string[];
  /** whether base is client (and we're in main map) */
  annotateClient: boolean;
  /** expression used as the map value */
  valueExpr: string;
};

/**
 * Definition for a component file
 * @public
 */
export interface ComponentFile {
  /** The original file path of the component */
  filePath: string;
  /** Normalized path that can be used for import statements */
  importPath: string;
  /** Normalized name that can be used as import */
  moduleName: string;
  /** Name of the code file */
  componentName: string;
  /** Detected component type (server, client, or universal) */
  componentType?: ComponentType;
}

/**
 * Definition for a component file with guaranteed componentType
 * @internal
 */
export interface ComponentFileWithType extends ComponentFile {
  /** Detected component type (server, client, or universal) */
  componentType: ComponentType;
}

/**
 * Definition for custom components to be included in component map.
 * Use this to define components imported from modules/dependencies/packages
 * @public
 */
export interface ComponentImport {
  /** The name of the import (e.g., 'MyComponent')*/
  importName: string;
  /** Information about how to import the package */
  importInfo: {
    /** The path from which to import the component(s) */
    importFrom: string;
    /** The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component. */
    namedImports?: string[];
  };
}

/**
 * Converts string to PascalCase.
 * @param {string} name - kebab-case, dot.notation, camelCase, or PascalCase string (e.g. `my-component`, `my_component`, `my.component`, `myComponent`)
 * @returns {string} PascalCase string (e.g. `MyComponent`)
 * @internal
 */
export const toPascalCase = (name: string): string =>
  name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

/**
 * Builds a lookup of component name -> set of (extensionless) import paths, used by
 * {@link isVariantComponent} to decide whether a dotted filename is a real SXA variant.
 * @param {Array<{ componentName: string; importPathNoExt: string }>} components - component name + extensionless import path pairs
 * @returns {Record<string, Set<string>>} index of component name to the set of import paths that produced it
 * @internal
 */
export const buildVariantSiblingIndex = (
  components: { componentName: string; importPathNoExt: string }[]
): Record<string, Set<string>> => {
  const index: Record<string, Set<string>> = {};
  for (const { componentName, importPathNoExt } of components) {
    (index[componentName] ??= new Set<string>()).add(importPathNoExt);
  }
  return index;
};

/**
 * Determines whether a component file is an SXA *variant* — its name carries a dotted
 * suffix AND a base (non-variant) sibling exists at the same import-path root. A dotted
 * name without a base sibling (e.g. Angular's `foo.component`) is NOT a variant.
 * @param {string} componentName - component name, possibly with a dotted variant suffix
 * @param {string} importPathNoExt - the component's import path with the file extension removed
 * @param {Record<string, Set<string>>} siblingIndex - index from {@link buildVariantSiblingIndex}
 * @returns {boolean} true when the file is a variant of an existing base component
 * @internal
 */
export const isVariantComponent = (
  componentName: string,
  importPathNoExt: string,
  siblingIndex: Record<string, Set<string>>
): boolean => {
  const dot = componentName.lastIndexOf('.');
  if (dot === -1) return false;
  const base = componentName.substring(0, dot);
  const importRoot = importPathNoExt.substring(0, importPathNoExt.lastIndexOf('.'));
  return Boolean(siblingIndex[base]?.has(importRoot));
};

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
            moduleName: name.replace(/[^\w]+/g, ''),
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

/**
 * Filters components by their detected type.
 * @param {ComponentFileWithType[]} components - Array of components with types
 * @param {ComponentType[]} allowedTypes - Array of allowed component types to filter by
 * @returns {ComponentFileWithType[]} Filtered array containing only components matching allowed types
 * @internal
 */
export function filterComponentsByType(
  components: ComponentFileWithType[],
  allowedTypes: ComponentType[]
): ComponentFileWithType[] {
  return components.filter((component) => allowedTypes.includes(component.componentType));
}
