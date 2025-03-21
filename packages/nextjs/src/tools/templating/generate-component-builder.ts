import path from 'path';
import fs from 'fs';
import { getComponentBuilderTemplate } from './templates/component-builder';
import {
  ComponentFile,
  PackageDefinition,
  getComponentList,
} from '@sitecore-content-sdk/core/tools';
import { watchItems } from './utils';

// Default destination path for component builder
const defaultComponentBuilderOutputPath = 'src/temp/componentBuilder.ts';
const defaultComponentRootPath = 'src/components';

/**
 * Generate component builder based on provided settings
 * @param {object} [settings] settings for component builder generation
 * @param {string} [settings.componentRootPaths] paths to components root
 * @param {string} [settings.componentBuilderOutputPath] path to component builder output
 * @param {PackageDefinition[]} [settings.packages] list of packages to include in component builder
 * @param {ComponentFile[]} [settings.components] list of components to include in component builder
 * @param {boolean} [settings.watch] whether to watch for changes to component builder sources
 */
export function generateComponentBuilder({
  componentRootPaths = [defaultComponentRootPath],
  componentBuilderOutputPath = defaultComponentBuilderOutputPath,
  packages = [],
  components = [],
  watch,
}: {
  componentRootPaths?: string[];
  componentBuilderOutputPath?: string;
  packages?: PackageDefinition[];
  components?: ComponentFile[];
  watch?: boolean;
} = {}) {
  return async () => {
    if (watch) {
      watchComponentBuilder({
        componentRootPaths,
        componentBuilderOutputPath,
        packages,
        components,
      });
    } else {
      writeComponentBuilder({
        componentRootPaths,
        componentBuilderOutputPath,
        packages,
        components,
      });
    }
  };
}

// TODO: cleanup/remove
/**
 * Watch for changes to component builder sources
 * @param {object} settings settings for component builder generation
 * @param {string[]} settings.componentRootPaths path to components root
 * @param {string} settings.componentBuilderOutputPath path to component builder output
 * @param {PackageDefinition[]} settings.packages list of packages to include in component builder
 * @param {ComponentFile[]} settings.components list of components to include in component builder
 */
export function watchComponentBuilder({
  componentRootPaths,
  componentBuilderOutputPath,
  packages,
  components,
}: {
  componentRootPaths: string[];
  componentBuilderOutputPath: string;
  packages: PackageDefinition[];
  components: ComponentFile[];
}) {
  console.log(`Watching for changes to component builder sources in ${componentRootPaths}...`);

  watchItems(
    componentRootPaths,
    writeComponentBuilder.bind(null, {
      componentRootPaths,
      componentBuilderOutputPath,
      packages,
      components,
    })
  );
}

/**
 * Write component builder to file
 * @param {object} settings settings for component builder generation
 * @param {string[]} settings.componentRootPaths path to components root
 * @param {string} settings.componentBuilderOutputPath path to component builder output
 * @param {PackageDefinition[]} settings.packages list of packages to include in component builder
 * @param {ComponentFile[]} settings.components list of components to include in component builder
 */
export function writeComponentBuilder({
  componentRootPaths,
  componentBuilderOutputPath,
  packages,
  components,
}: {
  componentRootPaths: string[];
  componentBuilderOutputPath: string;
  packages: PackageDefinition[];
  components: ComponentFile[];
}) {
  const items: (ComponentFile | PackageDefinition)[] = [
    ...packages,
    ...components,
    ...getComponentList(componentRootPaths),
  ];

  const componentBuilderPath = path.resolve(componentBuilderOutputPath);
  const fileContent = getComponentBuilderTemplate(items);
  console.log(`Writing component builder to ${componentBuilderPath}`);
  fs.writeFileSync(componentBuilderPath, fileContent, {
    encoding: 'utf8',
  });
}
