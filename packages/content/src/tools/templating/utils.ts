import path from 'path';
import {
  ComponentFile,
  ComponentFileWithType,
  ComponentImport,
  ComponentMapEntry,
} from './components';

const DEFAULT_HEADER_COMMENT =
  "Below are built-in components that are available in the app, it's recommended to keep them as is";

/**
 * A component source can be either a file or a file with type information.
 */
type ComponentSource = ComponentFile | ComponentFileWithType;

/**
 * Template options for component map generation
 */
type TemplateOptions = {
  /** Custom header comment for the generated map */
  headerComment?: string;
  /** Whether this is a client-only map (no need for componentType annotations). Only used in frameworks that make server/client distinction. */
  isClientMap?: boolean;
  /** Built-in imports string to include in the map */
  builtInImports?: string;
  /** Built-in map entries to include in the map */
  builtInMapEntries?: string[];
  /** Framework name to use in the component map */
  framework: string;
};

/**
 * Transform component description entries for the component map.
 * @param {ComponentSource[]} components - The components to transform.
 * @param {object} opts - The options for the transformation.
 * @param {boolean} opts.includeVariants - Whether to include variants in the component map.
 * @param {boolean} opts.shouldAnnotateClient - Whether to annotate the client in the component map. Used in frameworks that make server/client distinction.
 * @returns {ComponentMapEntry[]} The transformed component description entries.
 * @internal
 */
export const prepareComponentsForMap = (
  components: ComponentSource[],
  opts: { includeVariants: boolean; shouldAnnotateClient?: boolean }
): ComponentMapEntry[] => {
  const groups = new Map<
    string,
    { dir: string; prefix: string; base?: ComponentSource; neighbors: ComponentSource[] }
  >();

  const getPrefix = (name: string) => {
    const index = name.indexOf('.');
    return index === -1 ? name : name.slice(0, index);
  };

  for (const file of components) {
    const dir = path.dirname(file.filePath).replace(/\\/g, '/');
    const prefix = getPrefix(file.componentName);
    const key = `${dir}::${prefix}`;

    let group = groups.get(key);
    if (!group) {
      group = { dir, prefix, neighbors: [] };
      groups.set(key, group);
    }

    if (file.componentName === prefix) group.base = file;
    else group.neighbors.push(file);
  }

  const entries: ComponentMapEntry[] = [];

  for (const group of groups.values()) {
    const imports: string[] = [];

    if (opts.includeVariants) {
      const spreads: string[] = [];
      for (const neighbor of group.neighbors) {
        imports.push(`import * as ${neighbor.moduleName} from '${neighbor.importPath}';`);
        spreads.push(`...${neighbor.moduleName}`);
      }
      if (group.base) {
        imports.push(`import * as ${group.base.moduleName} from '${group.base.importPath}';`);
        spreads.push(`...${group.base.moduleName}`);
      }
      const annotateClient = opts.shouldAnnotateClient
        ? !!group.base && 'componentType' in group.base && group.base.componentType === 'client'
        : false;

      let valueExpr: string;
      if (spreads.length) {
        valueExpr = spreads.join(', ');
      } else {
        valueExpr = group.base ? group.base.moduleName : group.neighbors[0].moduleName;
      }

      entries.push({
        key: group.prefix,
        imports,
        valueExpr,
        annotateClient,
      });
    } else {
      // Variants disabled: single entry per group
      if (group.base) {
        imports.push(`import * as ${group.base.moduleName} from '${group.base.importPath}';`);
        const annotateClient = opts.shouldAnnotateClient
          ? 'componentType' in group.base && group.base.componentType === 'client'
          : false;
        entries.push({
          key: group.prefix,
          imports,
          valueExpr: group.base.moduleName,
          annotateClient,
        });
      } else if (group.neighbors.length) {
        const first = group.neighbors[0];
        imports.push(`import * as ${first.moduleName} from '${first.importPath}';`);
        entries.push({
          key: group.prefix,
          imports,
          valueExpr: first.moduleName,
          annotateClient: opts.shouldAnnotateClient ?? false,
        });
      }
    }
  }

  return entries;
};

/**
 * Cross framework function to build the component map content.
 * @param {ComponentMapEntry[]} entries - The entries to build the component map content for.
 * @param {ComponentImport[] | undefined} componentImports - The component imports to build the component map content for.
 * @param {TemplateOptions} options - The options for the buildComponentMapContent function.
 * @returns {string} The component map content.
 * @internal
 */
export const buildComponentMapContent = (
  entries: ComponentMapEntry[],
  componentImports: ComponentImport[] | undefined,
  options: TemplateOptions
): string => {
  const {
    headerComment = DEFAULT_HEADER_COMMENT,
    isClientMap = false,
    framework,
    builtInImports = '',
    builtInMapEntries = [],
  } = options;

  if (!framework) {
    throw new Error('options.framework is required to build the component map');
  }

  const frameworkComponentTypeName = `${
    framework.charAt(0).toUpperCase() + framework.slice(1)
  }ContentSdkComponent`;
  const frameworkImportString = `import { ${frameworkComponentTypeName} } from '@sitecore-content-sdk/${framework}';\n`;
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];

  // Add per-entry imports
  entries.forEach((e) => wildcardImports.push(...e.imports));

  // Handle package imports
  componentImports?.forEach((pkg) => {
    if (pkg.importInfo.namedImports) {
      namedImports.push(
        `import { ${pkg.importInfo.namedImports.join(', ')} } from '${pkg.importInfo.importFrom}';`
      );
    } else {
      wildcardImports.push(`import * as ${pkg.importName} from '${pkg.importInfo.importFrom}';`);
    }
  });

  const importLines = [
    builtInImports.length ? '// end of built-in import section' : null,
    ...wildcardImports,
    ...namedImports,
  ].filter(Boolean) as string[];

  const importsSection = importLines.length ? `\n${importLines.join('\n')}` : '';

  // Clone to avoid mutating the caller's array
  const componentMapEntries: string[] = structuredClone(builtInMapEntries);
  for (const e of entries) {
    const value =
      !isClientMap && e.annotateClient
        ? `{ ${e.valueExpr}, componentType: 'client' }`
        : e.valueExpr.includes('...')
        ? `{ ${e.valueExpr} }`
        : e.valueExpr;
    componentMapEntries.push(`['${e.key}', ${value}]`);
  }

  // Add package-based entries
  componentImports?.forEach((pkg) => {
    if (pkg.importInfo.namedImports) {
      pkg.importInfo.namedImports.forEach((name: string) => {
        componentMapEntries.push(`['${name}', ${name}]`);
      });
    } else {
      componentMapEntries.push(`['${pkg.importName}', ${pkg.importName}]`);
    }
  });

  return `// ${headerComment}
${frameworkImportString}
${builtInImports}${importsSection}

export const componentMap = new Map<string, ${frameworkComponentTypeName}>([
${componentMapEntries
  .map((component) => {
    return `  ${component},\n`;
  })
  .join('')}]);

export default componentMap;
`;
};
