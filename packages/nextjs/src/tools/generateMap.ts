import { ComponentFile, getComponentList } from '@sitecore-content-sdk/core/tools';
import path from 'path';
import fs from 'fs';

/**
 * Definition for custom components to be included in component map.
 * Use this to define components imported from modules/dependencies/packages
 * @typedef  PackageDefinition
 * @property {string} name - Name of the import.
 * @property {object} importInfo - Information about how to import the package.
 * @property {string} importInfo.importFrom - The path from which to import the component(s).
 * @property {string[] | '*'} importInfo.imports - The specific named components to import from the package, or set this to '*' to allow SXA variants support for component.
 */
export interface PackageDefinition {
  name: string;
  importInfo: {
    importFrom: string;
    imports: string[] | '*';
  };
}

/**
 * Arguments for the generateMap function.
 * @typedef GenerateMapArgs
 * @property {string[]} paths - Array of component paths to include in component map.
 * @property {string} [destination='src/.sitecore'] - Destination folder path for the generated map.
 * @property {PackageDefinition[]} [packages] - Optional array of package definitions to include in the map.
 * @property {string[]} [exclude] - Optional array of paths to exclude from the map.
 */
export type GenerateMapArgs = {
  paths: string[];
  destination?: string;
  packages?: PackageDefinition[];
  exclude?: string[];
};

/**
 * Compares two paths to determine if they match.
 * @param {string} componentPath base path to compare against, can be absolute or relative
 * @param {string} compare comparer, can be relate, absolute or regex string
 * @returns true if paths match, false otherwise
 */
export const matchPath = (componentPath: string, compare: string): boolean => {
  if (
    compare === componentPath ||
    path.join(process.cwd(), componentPath) === compare ||
    componentPath === path.join(process.cwd(), compare) ||
    new RegExp(compare).test(componentPath)
  ) {
    return true;
  }
  return false;
};

/**
 * Generate and write componentMap.ts file based on provided params.
 * @param {GenerateMapArgs} param0 params for generateMap
 */
export const generateMap = async ({
  paths,
  destination = '.sitecore',
  exclude,
  packages,
}: GenerateMapArgs): Promise<void> => {
  const components = paths.reduce<ComponentFile[]>((result, componentPath) => {
    for (const exclusion of exclude || []) {
      if (matchPath(componentPath, exclusion)) {
        return result;
      }
    }
    return result.concat(...getComponentList(componentPath));
  }, []);

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

const mapTemplate = (components: ComponentFile[], packages?: PackageDefinition[]): string => {
  const wildcardImports: string[] = [];
  const namedImports: string[] = [];

  const componentMapEntries: string[] = [];

  components.forEach((component) => {
    wildcardImports.push(`import * as ${component.moduleName} from '${component.path}';`);
    componentMapEntries.push(`['${component.moduleName}', ${component.moduleName}]`);
  });

  packages?.forEach((packageEntry) => {
    if (packageEntry.importInfo.imports === '*') {
      wildcardImports.push(
        `import * as ${packageEntry.name} from '${packageEntry.importInfo.importFrom}';`
      );
      componentMapEntries.push(`['${packageEntry.name}', ${packageEntry.name}]`);
    } else {
      namedImports.push(
        `import { ${packageEntry.importInfo.imports.join(', ')} } from '${
          packageEntry.importInfo.importFrom
        }';`
      );
      packageEntry.importInfo.imports.forEach((importName) => {
        componentMapEntries.push(`['${importName}', ${importName}]`);
      });
    }
  });

  return `// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsJssComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
${wildcardImports.join('\n')}
${namedImports.join('\n')}

// Components must be registered with to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsJssComponent>([
${componentMapEntries
  .map((component) => {
    return `  ${component},\n`;
  })
  .join('')}]);

export default componentMap;
`;
};
