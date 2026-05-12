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
import { detectRouterType, getComponentListWithTypes } from './templating/utils';

// default client template
export const defaultClientMapTemplate: EnhancedComponentMapTemplate = (
  components,
  componentImports,
  ctx
) => {
  const builtInImports = `
import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

  const builtInMapEntries = [
    `['BYOCWrapper', BYOCClientWrapper]`,
    `['FEaaSWrapper', FEaaSClientWrapper]`,
    `['Form', Form]`,
  ];

  const entries =
    ctx?.entries ??
    prepareComponentsForMap(components as ComponentFileWithType[], {
      includeVariants: ctx?.includeVariants ?? true,
      shouldAnnotateClient: true,
    });

  return buildComponentMapContent(entries, componentImports, {
    headerComment: 'Client-safe component map for App Router',
    isClientMap: true,
    builtInImports,
    builtInMapEntries,
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
      // default app router server map
      const builtInImports = `
import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
`;

      const builtInMapEntries = [
        `['BYOCWrapper', BYOCServerWrapper]`,
        `['FEaaSWrapper', FEaaSServerWrapper]`,
        `['Form', { ...Form, componentType: 'client' }]`,
      ];
      mainContent = buildComponentMapContent(getComponents.entries, componentImports, {
        headerComment:
          "Below are built-in components that are available in the app, it's recommended to keep them as is",
        isClientMap: false,
        builtInImports,
        builtInMapEntries,
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
    const content = buildComponentMapContent(components, componentImports, {
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
