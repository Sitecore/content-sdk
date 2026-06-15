import {
  ComponentFile,
  GenerateMapArgs,
  GenerateMapFunction,
  ComponentImport,
  filterComponentsByType,
  ComponentFileWithType,
  EnhancedComponentMapTemplate,
  ComponentMapTemplate,
  ComponentMapEntry,
} from '@sitecore-content-sdk/content/tools';
import * as path from 'path';
import * as fs from 'fs';
import { detectRouterType, getComponentListWithTypes, ROUTER_TYPE } from './templating/utils';

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
  /** Whether this is a client-only map (no need for componentType annotations) */
  isClientMap?: boolean;
  /** Built-in imports string to include in the map */
  builtInImports: string;
  /** Built-in map entries to include in the map */
  builtInMapEntries: string[];
};

const DEFAULT_HEADER_COMMENT =
  "Below are built-in components that are available in the app, it's recommended to keep them as is";

const APP_ROUTER_BUILTIN_IMPORTS = `
import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const APP_ROUTER_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCServerWrapper]`,
  `['FEaaSWrapper', FEaaSServerWrapper]`,
  `['Form', { ...Form, componentType: 'client' }]`,
];

const PAGES_ROUTER_BUILTIN_IMPORTS = `
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const PAGES_ROUTER_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCWrapper]`,
  `['FEaaSWrapper', FEaaSWrapper]`,
  `['Form', Form]`,
];

const CLIENT_MAP_BUILTIN_IMPORTS = `
import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const CLIENT_MAP_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCClientWrapper]`,
  `['FEaaSWrapper', FEaaSClientWrapper]`,
  `['Form', Form]`,
];

// Common builder for Next.js component map content
const prepareComponentsForMap = (
  components: ComponentSource[],
  opts: { includeVariants: boolean }
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
      const annotateClient =
        !!group.base && 'componentType' in group.base && group.base.componentType === 'client';

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
        const annotateClient =
          'componentType' in group.base && group.base.componentType === 'client';
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
          annotateClient: false,
        });
      }
    }
  }

  return entries;
};

/**
 * Distinguishes the simple 2-arity ComponentMapTemplate from the 3-arity EnhancedComponentMapTemplate.
 * @param {ComponentMapTemplate | EnhancedComponentMapTemplate} fn The template function to check.
 * @internal
 */
const isComponentMapTemplate = (
  fn: ComponentMapTemplate | EnhancedComponentMapTemplate
): fn is ComponentMapTemplate => fn.length === 2;

const buildNextjsMapContent = (
  entries: ComponentMapEntry[],
  componentImports: ComponentImport[] | undefined,
  options: TemplateOptions
): string => {
  const {
    headerComment = DEFAULT_HEADER_COMMENT,
    isClientMap = false,
    builtInImports,
    builtInMapEntries,
  } = options;

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
    headerComment.includes('built-in') ? '// end of built-in components' : null,
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
${builtInImports}${importsSection}

export const componentMap = new Map<string, NextjsContentSdkComponent>([
${componentMapEntries
  .map((component) => {
    return `  ${component},\n`;
  })
  .join('')}]);

export default componentMap;
`;
};

// Default App Router (server) component map template
export const defaultServerMapTemplate: EnhancedComponentMapTemplate = (
  components,
  componentImports,
  ctx
) => {
  const entries =
    ctx?.entries ??
    prepareComponentsForMap(components as ComponentFileWithType[], {
      includeVariants: ctx?.includeVariants ?? true,
    });

  return buildNextjsMapContent(entries, componentImports, {
    headerComment: DEFAULT_HEADER_COMMENT,
    isClientMap: false,
    builtInImports: APP_ROUTER_BUILTIN_IMPORTS,
    builtInMapEntries: APP_ROUTER_BUILTIN_ENTRIES,
  });
};

// Default client-safe component map template for App Router
export const defaultClientMapTemplate: EnhancedComponentMapTemplate = (
  components,
  componentImports,
  ctx
) => {
  const entries =
    ctx?.entries ??
    prepareComponentsForMap(components as ComponentFileWithType[], {
      includeVariants: ctx?.includeVariants ?? true,
    });

  return buildNextjsMapContent(entries, componentImports, {
    headerComment: 'Client-safe component map for App Router',
    isClientMap: true,
    builtInImports: CLIENT_MAP_BUILTIN_IMPORTS,
    builtInMapEntries: CLIENT_MAP_BUILTIN_ENTRIES,
  });
};

export type CollectFilter = 'all' | 'client' | 'server' | 'universal';

// Collect components from specified paths, apply exclude and type filter, and prepare map entries.
const collectComponents = (opts: {
  paths: string[];
  exclude?: string[];
  includeVariants: boolean;
  filter?: CollectFilter;
}): {
  raw: ComponentFileWithType[];
  entries: ComponentMapEntry[];
} => {
  const withTypes = getComponentListWithTypes(opts.paths, opts.exclude, opts.includeVariants);

  const filtered =
    opts.filter === 'client'
      ? filterComponentsByType(withTypes, ['client', 'universal'])
      : withTypes;

  for (const file of filtered) {
    console.debug(`Registering Content SDK component ${file.componentName}`);
  }

  return {
    raw: filtered,
    entries: prepareComponentsForMap(filtered, { includeVariants: opts.includeVariants }),
  };
};

/**
 * Generate and write componentMap.ts files based on provided params.
 *
 * Pages Router:
 * - component-map.ts          : Single component map with Pages Router wrappers
 *
 * App Router (clientComponentMap=true or undefined):
 * - component-map.ts          : Full component map with all components (server, client, universal)
 * - component-map.client.ts   : Client-safe map with client + universal components
 *
 * App Router (clientComponentMap=false):
 * - component-map.ts          : Full component map with all components (server, client, universal)
 * - component-map.client.ts   : Client-safe map with built-in components only (no user components)
 *
 * When includeVariants is true:
 * - Includes component **variants** in the generated map(s) alongside base components
 * - Preserves the same client/server filtering rules (variants obey clientComponentMap filtering)
 * - Variant entries are emitted using the same naming/keys convention as their base components
 *
 * Template Customization:
 * - mapTemplate: Custom template for main component map (works for both single and dual map modes)
 * - clientMapTemplate: Custom template for client component map (App Router only)
 * @param {GenerateMapArgs} params - The parameters for the generateMap function.
 * @public
 */
export const generateMap: GenerateMapFunction = ({
  paths,
  destination = '.sitecore',
  exclude,
  componentImports,
  mapTemplate,
  clientMapTemplate,
  clientComponentMap,
  includeVariants = true,
}: GenerateMapArgs) => {
  const routerType = detectRouterType();
  const allComponents = collectComponents({ paths, exclude, includeVariants, filter: 'all' });

  if (routerType === ROUTER_TYPE.PAGES) {
    const content = mapTemplate
      ? (mapTemplate as EnhancedComponentMapTemplate)(allComponents.raw, componentImports, {
          entries: allComponents.entries,
          includeVariants,
          isClientMap: false,
        })
      : buildNextjsMapContent(allComponents.entries, componentImports, {
          isClientMap: false,
          builtInImports: PAGES_ROUTER_BUILTIN_IMPORTS,
          builtInMapEntries: PAGES_ROUTER_BUILTIN_ENTRIES,
        });

    try {
      fs.writeFileSync(path.join(process.cwd(), destination, 'component-map.ts'), content, 'utf8');
    } catch (error) {
      console.error(
        `Component Map generation failed. Error writing to file ${destination}:`,
        error
      );
      throw error;
    }

    return;
  }

  const mainContent = mapTemplate
    ? (mapTemplate as EnhancedComponentMapTemplate)(allComponents.raw, componentImports, {
        entries: allComponents.entries,
        includeVariants,
        isClientMap: false,
      })
    : defaultServerMapTemplate(allComponents.raw, componentImports, {
        entries: allComponents.entries,
        includeVariants,
        isClientMap: false,
      });

  try {
    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.ts'),
      mainContent,
      'utf8'
    );
  } catch (error) {
    console.error(
      `Main Component Map generation failed. Error writing to file ${destination}:`,
      error
    );
    throw error;
  }

  // clientComponentMap=true  -> include user client+universal components
  // clientComponentMap=undefined  -> include user client+universal components
  // clientComponentMap=false -> built-ins only
  const shouldGenerateClientMap = clientComponentMap ?? true;
  const clientComponents = shouldGenerateClientMap
    ? collectComponents({ paths, exclude, includeVariants, filter: 'client' })
    : { raw: [] as ComponentFileWithType[], entries: [] as ComponentMapEntry[] };

  const clientTemplate = clientMapTemplate || defaultClientMapTemplate;
  let clientContent: string;
  if (isComponentMapTemplate(clientTemplate))
    clientContent = clientTemplate(clientComponents.raw, componentImports);
  else
    clientContent = clientTemplate(clientComponents.raw, componentImports, {
      entries: clientComponents.entries,
      includeVariants,
      isClientMap: true,
    });

  try {
    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.client.ts'),
      clientContent,
      'utf8'
    );
  } catch (error) {
    console.error(
      `Client Component Map generation failed. Error writing to file ${destination}:`,
      error
    );
    throw error;
  }
};
