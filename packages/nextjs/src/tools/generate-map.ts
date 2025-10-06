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
} from '@sitecore-content-sdk/core/tools';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Generate and write componentMap.ts file based on provided params.
 *
 * When clientComponentMap is true, generates:
 * - component-map.ts: Full component map with all components (server, client, universal)
 * - component-map.client.ts: Client-safe map with only client + universal components
 *
 * When clientComponentMap is false, generates:
 * - component-map.ts: Single component map (traditional behavior)
 *
 * Template Customization:
 * - mapTemplate: Custom template for main component map (works for both single and dual map modes)
 * - clientMapTemplate: Custom template for client component map (only used when clientComponentMap is true)
 *
 * @param {GenerateMapArgs} param0 params for generateMap
 */
export const generateMap: GenerateMapFunction = ({
  paths,
  destination = '.sitecore',
  exclude,
  componentImports,
  mapTemplate = nextjsMapTemplate,
  clientMapTemplate,
  clientComponentMap,
}: GenerateMapArgs) => {
  // Default behavior: if clientComponentMap is not specified, auto-detect based on router type
  const shouldGenerateClientMap = clientComponentMap ?? detectRouterType() === 'app';

  if (shouldGenerateClientMap) {
    const componentsWithTypes = getComponentListWithTypes(paths, exclude);

    // Generate regular component map (all components with type information)
    // Use custom mapTemplate if provided (assumes it can handle ComponentFileWithType[]),
    // otherwise use default template designed for typed components
    const regularMapContent = mapTemplate
      ? mapTemplate(componentsWithTypes, componentImports)
      : nextjsMapTemplateWithTypes(componentsWithTypes, componentImports);
    const regularMapFile = path.join(process.cwd(), destination, 'component-map.ts');

    try {
      fs.writeFileSync(regularMapFile, regularMapContent, { encoding: 'utf8' });
    } catch (error) {
      console.error(
        `Component Map generation failed. Error writing to file ${destination}:`,
        error
      );
      throw error;
    }

    // Generate client component map (client + universal components only)
    // Use custom clientMapTemplate if provided, otherwise use default
    const clientComponents = filterComponentsByType(componentsWithTypes, ['client', 'universal']);
    const clientMapTemplateToUse = clientMapTemplate || nextjsClientMapTemplate;
    const clientMapContent = clientMapTemplateToUse(clientComponents, componentImports);
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
  } else {
    // Pages Router - generate single component map
    const components = getComponentList(paths, exclude);
    const componentMapContent = mapTemplate(components, componentImports);
    const componentMapFile = path.join(process.cwd(), destination, 'component-map.ts');

    try {
      fs.writeFileSync(componentMapFile, componentMapContent, { encoding: 'utf8' });
    } catch (error) {
      console.error(
        `Component Map generation failed. Error writing to file ${destination}:`,
        error
      );
      throw error;
    }
  }
};

/**
 * Template options for component map generation
 */
type TemplateOptions = {
  /** Whether to include inline componentType for non-universal components */
  includeComponentType?: boolean;
  /** Custom header comment for the generated map */
  headerComment?: string;
};

/**
 * Unified template function for all component map generation
 */
const nextjsUnifiedTemplate = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports?: ComponentImport[],
  options: TemplateOptions = {}
): string => {
  const {
    includeComponentType = false,
    headerComment = "Below are built-in components that are available in the app, it's recommended to keep them as is",
  } = options;

  const wildcardImports: string[] = [];
  const namedImports: string[] = [];
  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    // Clean imports only
    wildcardImports.push(`import * as ${component.moduleName} from '${component.importPath}';`);

    // Handle componentType if requested and available
    if (
      includeComponentType &&
      'componentType' in component &&
      component.componentType !== 'universal'
    ) {
      componentMapEntries.push(
        `['${component.moduleName}', {...${component.moduleName}, componentType: '${component.componentType}'}]`
      );
    } else {
      componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
    }
  });

  // Process component imports (identical across all templates)
  componentImports?.forEach((packageEntry) => {
    if (packageEntry.importInfo.namedImports) {
      namedImports.push(
        `import { ${packageEntry.importInfo.namedImports.join(', ')} } from '${
          packageEntry.importInfo.importFrom
        }';`
      );
      packageEntry.importInfo.namedImports.forEach((importName: string) => {
        componentMapEntries.push(`['${importName}', ${importName}]`);
      });
    } else {
      wildcardImports.push(
        `import * as ${packageEntry.importName} from '${packageEntry.importInfo.importFrom}';`
      );
      componentMapEntries.push(`['${packageEntry.importName}', ${packageEntry.importName}]`);
    }
  });

  // Build imports section, filtering out empty arrays
  const importLines = [
    headerComment.includes('built-in') ? '// end of built-in components' : null,
    ...wildcardImports,
    ...namedImports,
  ].filter((line) => line !== null && line !== '');

  const importsSection = importLines.length > 0 ? `\n${importLines.join('\n')}` : '';

  return `// ${headerComment}
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';${importsSection}

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
${componentMapEntries
  .map((component) => {
    return `  ${component},\n`;
  })
  .join('')}]);

export default componentMap;
`;
};

// Wrapper functions for backward compatibility
const nextjsMapTemplateWithTypes = (
  components: ComponentFileWithType[],
  componentImports?: ComponentImport[]
): string => {
  return nextjsUnifiedTemplate(components, componentImports, {
    includeComponentType: true,
    headerComment:
      "Below are built-in components that are available in the app, it's recommended to keep them as is",
  });
};

const nextjsMapTemplate = (
  components: ComponentFile[],
  componentImports?: ComponentImport[]
): string => {
  return nextjsUnifiedTemplate(components, componentImports, {
    includeComponentType: false,
    headerComment:
      "Below are built-in components that are available in the app, it's recommended to keep them as is",
  });
};

const nextjsClientMapTemplate = (
  components: ComponentFileWithType[],
  componentImports?: ComponentImport[]
): string => {
  return nextjsUnifiedTemplate(components, componentImports, {
    includeComponentType: false, // Client components are already filtered, no need for type info
    headerComment: 'Client-safe component map for App Router',
  });
};
