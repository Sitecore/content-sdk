import { ComponentFile, ComponentImport, ComponentFileWithType } from './templating';

export type GenerateMapFunction = (args: GenerateMapArgs) => void;

/**
 * Arguments for the generateMap function.
 * @typedef GenerateMapArgs
 * @property {string[]} paths - Array of component paths to include in component map.
 * @property {string} [destination='src/.sitecore'] - Destination folder path for the generated map.
 * @property {ComponentImport[]} [componentImports] - Optional array of package definitions for component imports to include in the map.
 * @property {string[]} [exclude] - Optional array of glob paths to exclude from the map.
 * @property {Function} [mapTemplate] - Optional custom template function to generate the main component map content.
 * @property {Function} [clientMapTemplate] - Optional custom template function to generate the client component map content (only used when clientComponentMap is true).
 * @property {boolean} [clientComponentMap] - Optional flag to generate separate client and server component maps. When true,
 *                                            generates both component-map.ts (all components) and component-map.client.ts (client + universal only).
 *                                            When false or undefined, generates single component-map.ts (traditional behavior).
 * @property {boolean} [enableVariantsInMap] - Optional flag to include component's variants path in the component map.
 */
export type GenerateMapArgs = {
  paths: string[];
  destination?: string;
  componentImports?: ComponentImport[];
  exclude?: string[];
  mapTemplate?: (
    components: ComponentFile[] | ComponentFileWithType[],
    componentImports?: ComponentImport[]
  ) => string;
  clientMapTemplate?: (
    components: ComponentFileWithType[],
    componentImports?: ComponentImport[]
  ) => string;
  clientComponentMap?: boolean;
  enableVariantsInMap?: boolean;
};
