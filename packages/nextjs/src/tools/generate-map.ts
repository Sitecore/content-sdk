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
 * @param {GenerateMapArgs} param0 params for generateMap
 */
export const generateMap: GenerateMapFunction = ({
  paths,
  destination = '.sitecore',
  exclude,
  componentImports,
  mapTemplate = nextjsMapTemplate,
  routerType,
}: GenerateMapArgs) => {
  const detectedRouterType = routerType || detectRouterType();
  const shouldGenerateClientMap = detectedRouterType === 'app';

  if (shouldGenerateClientMap) {
    const componentsWithTypes = getComponentListWithTypes(paths, exclude);

    // Generate regular component map (all components with type information)
    const regularMapContent = nextjsMapTemplateWithTypes(componentsWithTypes, componentImports);
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
    const clientComponents = filterComponentsByType(componentsWithTypes, ['client', 'universal']);
    const clientMapContent = nextjsClientMapTemplate(clientComponents, componentImports);
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

const nextjsMapTemplateWithTypes = (
  components: ComponentFileWithType[],
  componentImports?: ComponentImport[]
): string => {
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];
  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    wildcardImports.push(`import * as ${component.moduleName} from '${component.importPath}';`);
    // Add fallback componentType if not exported by the component
    wildcardImports.push(
      `${component.moduleName}.componentType = ${component.moduleName}.componentType || '${component.componentType}';`
    );
    componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
  });

  componentImports?.forEach((packageEntry) => {
    if (packageEntry.importInfo.namedImports) {
      namedImports.push(
        `import { ${packageEntry.importInfo.namedImports.join(', ')} } from '${
          packageEntry.importInfo.importFrom
        }';`
      );
      packageEntry.importInfo.namedImports.forEach((importName) => {
        componentMapEntries.push(`['${importName}', ${importName}]`);
      });
    } else {
      wildcardImports.push(
        `import * as ${packageEntry.importName} from '${packageEntry.importInfo.importFrom}';`
      );
      componentMapEntries.push(`['${packageEntry.importName}', ${packageEntry.importName}]`);
    }
  });

  return `// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
${wildcardImports.join('\n')}
${namedImports.join('\n')}

// Components must be registered within the map to match the string key with component name in Sitecore
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

const nextjsMapTemplate = (
  components: ComponentFile[],
  componentImports?: ComponentImport[]
): string => {
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];

  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    wildcardImports.push(`import * as ${component.moduleName} from '${component.importPath}';`);
    componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
  });

  componentImports?.forEach((packageEntry) => {
    if (packageEntry.importInfo.namedImports) {
      namedImports.push(
        `import { ${packageEntry.importInfo.namedImports.join(', ')} } from '${
          packageEntry.importInfo.importFrom
        }';`
      );
      packageEntry.importInfo.namedImports.forEach((importName) => {
        componentMapEntries.push(`['${importName}', ${importName}]`);
      });
    } else {
      wildcardImports.push(
        `import * as ${packageEntry.importName} from '${packageEntry.importInfo.importFrom}';`
      );
      componentMapEntries.push(`['${packageEntry.importName}', ${packageEntry.importName}]`);
    }
  });

  return `// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
${wildcardImports.join('\n')}
${namedImports.join('\n')}

// Components must be registered within the map to match the string key with component name in Sitecore
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

const nextjsClientMapTemplate = (
  components: ComponentFileWithType[],
  componentImports?: ComponentImport[]
): string => {
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];
  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    wildcardImports.push(`import * as ${component.moduleName} from '${component.importPath}';`);
    componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
  });

  // Include all component imports for client map (built-in components are universal)
  const clientComponentImports = componentImports;

  clientComponentImports?.forEach((packageEntry) => {
    if (packageEntry.importInfo.namedImports) {
      namedImports.push(
        `import { ${packageEntry.importInfo.namedImports.join(', ')} } from '${
          packageEntry.importInfo.importFrom
        }';`
      );
      packageEntry.importInfo.namedImports.forEach((importName) => {
        componentMapEntries.push(`['${importName}', ${importName}]`);
      });
    } else {
      wildcardImports.push(
        `import * as ${packageEntry.importName} from '${packageEntry.importInfo.importFrom}';`
      );
      componentMapEntries.push(`['${packageEntry.importName}', ${packageEntry.importName}]`);
    }
  });

  return `// Client-safe component map for App Router
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

${wildcardImports.join('\n')}
${namedImports.join('\n')}

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
