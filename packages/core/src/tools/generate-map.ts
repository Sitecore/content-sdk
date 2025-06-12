import { PackageImport } from './templating';

export type GenerateMapFunction = (args: GenerateMapArgs) => void;

/**
 * Arguments for the generateMap function.
 * @typedef GenerateMapArgs
 * @property {string[]} paths - Array of component paths to include in component map.
 * @property {string} [destination='src/.sitecore'] - Destination folder path for the generated map.
 * @property {PackageImport[]} [packages] - Optional array of package definitions to include in the map.
 * @property {string[]} [exclude] - Optional array of paths to exclude from the map.
 */
export type GenerateMapArgs = {
  paths: string[];
  destination?: string;
  packages?: PackageImport[];
  exclude?: string[];
};
