import {
  ComponentFile,
  GenerateMapArgs,
  GenerateMapFunction,
  ComponentImport,
  detectRouterType,
  getComponentListWithTypes,
  filterComponentsByType,
  ComponentFileWithType,
  EnhancedComponentMapTemplate,
  ComponentMapTemplate,
  ComponentMapEntry,
  getComponentList,
} from '@sitecore-content-sdk/core/tools';
import * as path from 'path';
import * as fs from 'fs';

/**
 * A component source can be either a file or a file with type information.
 */
type ComponentSource = ComponentFile | ComponentFileWithType;

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
      for (const n of group.neighbors) {
        imports.push(`import * as ${n.moduleName} from '${n.importPath}';`);
        spreads.push(`...${n.moduleName}`);
      }
      if (group.base) {
        imports.push(`import * as ${group.base.moduleName} from '${group.base.importPath}';`);
        spreads.push(`...${group.base.moduleName}`);
      }
      const annotateClient =
        !!group.base && 'componentType' in group.base && group.base.componentType === 'client';

      entries.push({
        key: group.prefix,
        imports,
        valueExpr: spreads.length
          ? `{ ${spreads.join(', ')} }`
          : group.base
          ? group.base.moduleName
          : group.neighbors[0].moduleName,
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

const buildNextjsMapContent = (
  entries: ComponentMapEntry[],
  componentImports: ComponentImport[] | undefined,
  options: { headerComment?: string; isClientMap?: boolean } = {}
): string => {
  const {
    headerComment = "Below are built-in components that are available in the app, it's recommended to keep them as is",
    isClientMap = false,
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

  // Build entry lines (package named imports are appended below)
  const entryLines: string[] = [];
  for (const e of entries) {
    const value =
      !isClientMap && e.annotateClient
        ? `{ ...${e.valueExpr}, componentType: 'client' }`
        : e.valueExpr;
    entryLines.push(`  ['${e.key}', ${value}],`);
  }

  // Add package-based entries
  componentImports?.forEach((pkg) => {
    if (pkg.importInfo.namedImports) {
      pkg.importInfo.namedImports.forEach((name: string) => {
        entryLines.push(`  ['${name}', ${name}],`);
      });
    } else {
      entryLines.push(`  ['${pkg.importName}', ${pkg.importName}],`);
    }
  });

  return `// ${headerComment}
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';${importsSection}

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
${entryLines.join('\n')}
]);

export default componentMap;
`;
};

// default client template
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

  return {
    raw: filtered,
    entries: prepareComponentsForMap(filtered, { includeVariants: opts.includeVariants }),
  };
};

/**
 * Generate and write componentMap.ts files based on provided params.
 *
 * When clientComponentMap is true, generates:
 * - component-map.ts          : Full component map with all components (server, client, universal)
 * - component-map.client.ts   : Client-safe map with only client + universal components
 *
 * When clientComponentMap is false, generates:
 * - component-map.ts          : Single component map (traditional behavior)
 *
 * When includeVariants is true (in either mode):
 * - Includes component **variants** in the generated map(s) alongside base components
 * - Preserves the same client/server filtering rules (variants obey clientComponentMap filtering)
 * - Variant entries are emitted using the same naming/keys convention as their base components
 *
 * Template Customization:
 * - mapTemplate: Custom template for main component map (works for both single and dual map modes)
 * - clientMapTemplate: Custom template for client component map (only used when clientComponentMap is true)
 * @param {GenerateMapArgs} param0 params for generateMap
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
  const isAppRouter = detectRouterType() === 'app';
  const shouldGenerateClientMap = clientComponentMap ?? isAppRouter;

  if (shouldGenerateClientMap) {
    // App Router case, main map
    const getComponents = collectComponents({ paths, exclude, includeVariants, filter: 'all' });
    let mainContent: string;
    if (mapTemplate) {
      mainContent = (mapTemplate as EnhancedComponentMapTemplate)(
        getComponents.raw,
        componentImports,
        {
          entries: getComponents.entries,
          includeVariants,
          isClientMap: false,
        }
      );
    } else {
      mainContent = buildNextjsMapContent(getComponents.entries, componentImports, {
        headerComment:
          "Below are built-in components that are available in the app, it's recommended to keep them as is",
        isClientMap: false,
      });
    }
    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.ts'),
      mainContent,
      'utf8'
    );

    // App Router, client map
    const clientComponents = collectComponents({
      paths,
      exclude,
      includeVariants,
      filter: 'client',
    });
    const clientTemplate = clientMapTemplate || defaultClientMapTemplate;
    let clientContent: string;
    if (clientTemplate.length >= 2) {
      clientContent = (clientTemplate as ComponentMapTemplate)(
        clientComponents.raw,
        componentImports
      );
    } else {
      clientContent = (clientTemplate as EnhancedComponentMapTemplate)(
        clientComponents.raw,
        componentImports,
        {
          entries: clientComponents.entries,
          includeVariants,
          isClientMap: true,
        }
      );
    }
    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.client.ts'),
      clientContent,
      'utf8'
    );
  } else {
    // Either in pages/app router or clientComponentMap = false
    const components = collectComponents({
      paths,
      exclude,
      includeVariants,
      filter: 'all',
    }).entries;
    const content = buildNextjsMapContent(components, componentImports, {
      headerComment:
        "Below are built-in components that are available in the app, it's recommended to keep them as is",
      isClientMap: false,
    });
    fs.writeFileSync(path.join(process.cwd(), destination, 'component-map.ts'), content, 'utf8');

    // For App Router compatibility, always generate client map file even when clientComponentMap is false
    // When clientComponentMap is false, only include built-in components (no custom client components)
    if (shouldGenerateClientMap || isAppRouter) {
      const clientMapTemplateToUse = clientMapTemplate || defaultClientMapTemplate;
      const components = collectComponents({ paths: [], includeVariants, filter: 'all' });
      let clientMapContent: string;
      if (clientMapTemplateToUse.length >= 2) {
        clientMapContent = (clientMapTemplateToUse as ComponentMapTemplate)([], componentImports);
      } else {
        clientMapContent = (clientMapTemplateToUse as EnhancedComponentMapTemplate)(
          [],
          componentImports,
          {
            entries: components.entries,
            includeVariants,
            isClientMap: true,
          }
        );
      }

      const clientMapFile = path.join(process.cwd(), destination, 'component-map.client.ts');
      try {
        fs.writeFileSync(clientMapFile, clientMapContent, { encoding: 'utf8' });
      } catch (error) {
        console.error(
          `Client Component Map generation failed. Error writing to file ${destination}:`,
          error
        );
        throw error;
      }
    }
  }
};
