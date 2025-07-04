import { ComponentFile, ComponentImport } from './templating/index.js';

export type GenerateMapFunction = (args: GenerateMapArgs) => void;

/**
 * Arguments for the generateMap function.
 * @typedef GenerateMapArgs
 * @property {string[]} paths - Array of component paths to include in component map.
 * @property {string} [destination='src/.sitecore'] - Destination folder path for the generated map.
 * @property {ComponentImport[]} [componentImports] - Optional array of package definitions for component imports to include in the map.
 * @property {string[]} [exclude] - Optional array of glob paths to exclude from the map.
 * @property {Function} [mapTemplate] - Optional custom template function to generate the component map content.
 */
export type GenerateMapArgs = {
  paths: string[];
  destination?: string;
  componentImports?: ComponentImport[];
  exclude?: string[];
  mapTemplate?: (components: ComponentFile[], componentImports?: ComponentImport[]) => string;
};
