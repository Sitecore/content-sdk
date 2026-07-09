import {
  GenerateMapArgs,
  GenerateMapFunction,
  filterComponentsByType,
  ComponentFileWithType,
  EnhancedComponentMapTemplate,
  ComponentMapTemplate,
  ComponentMapEntry,
  prepareComponentsForMap,
  buildComponentMapContent,
} from '@sitecore-content-sdk/content/tools';
import * as path from 'path';
import * as fs from 'fs';
import { detectRouterType, getComponentListWithTypes, ROUTER_TYPE } from './templating/utils';

const APP_ROUTER_BUILTIN_IMPORTS = `
import { BYOCServerWrapper, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const APP_ROUTER_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCServerWrapper]`,
  `['FEaaSWrapper', FEaaSServerWrapper]`,
  `['Form', { ...Form, componentType: 'client' }]`,
];

const PAGES_ROUTER_BUILTIN_IMPORTS = `
import { BYOCWrapper, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const PAGES_ROUTER_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCWrapper]`,
  `['FEaaSWrapper', FEaaSWrapper]`,
  `['Form', Form]`,
];

const CLIENT_MAP_BUILTIN_IMPORTS = `
import { BYOCClientWrapper, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

const CLIENT_MAP_BUILTIN_ENTRIES = [
  `['BYOCWrapper', BYOCClientWrapper]`,
  `['FEaaSWrapper', FEaaSClientWrapper]`,
  `['Form', Form]`,
];

/**
 * Distinguishes the simple 2-arity ComponentMapTemplate from the 3-arity EnhancedComponentMapTemplate.
 * @param {ComponentMapTemplate | EnhancedComponentMapTemplate} fn The template function to check.
 * @internal
 */
const isComponentMapTemplate = (
  fn: ComponentMapTemplate | EnhancedComponentMapTemplate
): fn is ComponentMapTemplate => fn.length === 2;

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

  return buildComponentMapContent(entries, componentImports, {
    framework: 'nextjs',
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
      shouldAnnotateClient: true,
    });

  return buildComponentMapContent(entries, componentImports, {
    framework: 'nextjs',
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
    entries: prepareComponentsForMap(filtered, {
      includeVariants: opts.includeVariants,
      shouldAnnotateClient: true,
    }),
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
      : buildComponentMapContent(allComponents.entries, componentImports, {
          framework: 'nextjs',
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
