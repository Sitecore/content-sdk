import {
  ComponentFile,
  GenerateMapArgs,
  GenerateMapFunction,
  getComponentList,
  ComponentImport,
} from '@sitecore-content-sdk/core/tools';
import path from 'path';
import fs from 'fs';

/**
 * Generate and write componentMap.ts file based on provided params.
 * @param {GenerateMapArgs} param0 params for generateMap
 */
export const generateMap: GenerateMapFunction = ({
  paths,
  destination = '.sitecore',
  exclude,
  packages,
  mapTemplate = nextjsMapTemplate,
}: GenerateMapArgs) => {
  const components = getComponentList(paths, exclude);

  const componentMapContent = mapTemplate(components, packages);

  const componentMapFile = path.join(process.cwd(), destination, 'component-map.ts');

  try {
    fs.writeFileSync(componentMapFile, componentMapContent, {
      encoding: 'utf8',
    });
  } catch (error) {
    console.error(`Component Map generation failed. Error writing to file ${destination}:`, error);
    throw error;
  }
};

const nextjsMapTemplate = (
  components: ComponentFile[],
  packageImports?: ComponentImport[]
): string => {
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];

  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    wildcardImports.push(`import * as ${component.moduleName} from '${component.path}';`);
    componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
  });

  packageImports?.forEach((packageEntry) => {
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
import { BYOCWrapper, NextjsJssComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
${wildcardImports.join('\n')}
${namedImports.join('\n')}

// Components must be registered within the map to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsJssComponent>([
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
