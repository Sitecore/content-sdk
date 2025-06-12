import { ComponentFile, ComponentImport } from './templating';

export type GenerateMapFunction = (args: GenerateMapArgs) => void;

/**
 * Arguments for the generateMap function.
 * @typedef GenerateMapArgs
 * @property {string[]} paths - Array of component paths to include in component map.
 * @property {string} [destination='src/.sitecore'] - Destination folder path for the generated map.
 * @property {PackageDefinition[]} [packages] - Optional array of package definitions to include in the map.
 * @property {string[]} [exclude] - Optional array of paths to exclude from the map.
 * @property {function} [mapTemplate] - Optional custom template function to generate the component map content.
 */
export type GenerateMapArgs = {
  paths: string[];
  destination?: string;
  packages?: ComponentImport[];
  exclude?: string[];
  mapTemplate?: (components: ComponentFile[], packages?: ComponentImport[]) => string;
};
