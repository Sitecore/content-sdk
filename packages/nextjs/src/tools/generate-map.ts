import {
  ComponentFile,
  GenerateMapArgs,
  GenerateMapFunction,
  getComponentList,
  ComponentImport,
  detectRouterType,
  getComponentListWithTypes,
  filterComponentsByType,
  ComponentFileWithType,
  groupComponentsWithoutVariants,
  groupComponentsWithVariants,
  ComponentMapEntry,
  ComponentSource,
} from '@sitecore-content-sdk/core/tools';
import * as path from 'path';
import * as fs from 'fs';
import { stripVariants } from '../utils/utils';

/**
 * Template options for component map generation
 */
type TemplateOptions = {
  /** Custom header comment for the generated map */
  headerComment?: string;
  /** Whether this is a client-only map (no need for componentType annotations) */
  isClientMap?: boolean;
};

// Common builder for Next.js component map content
const buildNextjsMapContent = (
  components: ComponentSource[],
  componentImports: ComponentImport[] | undefined,
  opts: TemplateOptions,
  grouping: (components: ComponentSource[]) => ComponentMapEntry[]
): string => {
  const {
    headerComment = "Below are built-in components that are available in the app, it's recommended to keep them as is",
    isClientMap = false,
  } = opts;

  const wildcardImports: string[] = [];
  const namedImports: string[] = [];
  const entries: string[] = [];

  // Build per-entry imports/values via grouping
  const groups = grouping(components);
  for (const group of groups) {
    wildcardImports.push(...group.imports);
    const value =
      !isClientMap && group.annotateClient
        ? `{ ...${group.valueExpr}, componentType: 'client' }`
        : group.valueExpr;
    entries.push(`['${group.key}', ${value}]`);
  }

  // Package-based componentImports
  componentImports?.forEach((pkg) => {
    if (pkg.importInfo.namedImports) {
      namedImports.push(
        `import { ${pkg.importInfo.namedImports.join(', ')} } from '${pkg.importInfo.importFrom}';`
      );
      pkg.importInfo.namedImports.forEach((name: string) => {
        entries.push(`['${name}', ${name}]`);
      });
    } else {
      wildcardImports.push(`import * as ${pkg.importName} from '${pkg.importInfo.importFrom}';`);
      entries.push(`['${pkg.importName}', ${pkg.importName}]`);
    }
  });

  const importLines = [
    headerComment.includes('built-in') ? '// end of built-in components' : null,
    ...wildcardImports,
    ...namedImports,
  ].filter(Boolean) as string[];

  const importsSection = importLines.length ? `\n${importLines.join('\n')}` : '';

  return `// ${headerComment}
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';${importsSection}

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
${entries.map((e) => `  ${e},\n`).join('')}]);

export default componentMap;
`;
};

// Template that produces single map (no client/server split)
const nextjsUnifiedTemplate = (
  components: ComponentSource[],
  componentImports?: ComponentImport[],
  options: TemplateOptions = {}
): string => {
  return buildNextjsMapContent(
    components,
    componentImports,
    options,
    groupComponentsWithoutVariants
  );
};

// Template that produces single map with variants folded in
const nextjsUnifiedTemplateWithVariants = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports?: ComponentImport[],
  options: TemplateOptions = {}
): string => {
  return buildNextjsMapContent(components, componentImports, options, groupComponentsWithVariants);
};

// Template that produces client-only map (client + universal components)
const nextjsClientMapTemplate = (
  components: ComponentFileWithType[],
  componentImports?: ComponentImport[]
): string => {
  return nextjsUnifiedTemplate(components, componentImports, {
    headerComment: 'Client-safe component map for App Router',
    isClientMap: true,
  });
};

const pickTemplate = (enable: boolean = false) =>
  enable ? nextjsUnifiedTemplateWithVariants : nextjsUnifiedTemplate;

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
 * When enableVariantsInMap is true (in either mode):
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
  enableVariantsInMap,
}: GenerateMapArgs) => {
  console.log('enableVariantsInMap:', enableVariantsInMap);
  console.log('clientComponentMap:', clientComponentMap);
  const isAppRouter = detectRouterType() === 'app';
  const shouldGenerateClientMap = clientComponentMap ?? isAppRouter;

  if (shouldGenerateClientMap) {
    // In app router
    const allComponentsWithTypes = getComponentListWithTypes(paths, exclude);

    // MAIN map (all components)
    const resolvedComponents = enableVariantsInMap
      ? allComponentsWithTypes
      : stripVariants(allComponentsWithTypes);

    const regularMapContent = mapTemplate
      ? mapTemplate(resolvedComponents, componentImports)
      : pickTemplate(enableVariantsInMap)(resolvedComponents, componentImports, {
          headerComment:
            "Below are built-in components that are available in the app, it's recommended to keep them as is",
          isClientMap: false,
        });

    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.ts'),
      regularMapContent,
      'utf8'
    );

    // CLIENT map (client + universal only)
    const allClientComponents = filterComponentsByType(allComponentsWithTypes, [
      'client',
      'universal',
    ]);
    const clientComponents = enableVariantsInMap
      ? allClientComponents
      : stripVariants(allClientComponents);

    const clientMapContent = clientMapTemplate
      ? clientMapTemplate(clientComponents, componentImports)
      : pickTemplate(enableVariantsInMap)(clientComponents, componentImports, {
          headerComment: 'Client-safe component map for App Router',
          isClientMap: true,
        });

    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.client.ts'),
      clientMapContent,
      'utf8'
    );
  } else {
    // Either in pages/app router or clientComponentMap = false
    const allComponents = getComponentList(paths, exclude);

    // MAIN map (all components)
    const resolvedComponents = enableVariantsInMap ? allComponents : stripVariants(allComponents);
    const componentMapContent = mapTemplate
      ? mapTemplate(resolvedComponents, componentImports)
      : pickTemplate(enableVariantsInMap)(resolvedComponents, componentImports, {
          headerComment:
            "Below are built-in components that are available in the app, it's recommended to keep them as is",
          isClientMap: false,
        });

    fs.writeFileSync(
      path.join(process.cwd(), destination, 'component-map.ts'),
      componentMapContent,
      'utf8'
    );

    // For App Router compatibility, always generate client map file even when clientComponentMap is false
    // When clientComponentMap is false, only include built-in components (no custom client components)
    if (shouldGenerateClientMap || isAppRouter) {
      const clientMapTemplateToUse = clientMapTemplate || nextjsClientMapTemplate;
      const clientMapContent = clientMapTemplateToUse([], componentImports); // Empty array = only built-ins
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
