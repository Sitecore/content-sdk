import { ComponentImport, ComponentMapTemplate, EnhancedComponentMapTemplate } from './templating';

export type GenerateMapFunction = (args: GenerateMapArgs) => void;

/**
 * Arguments for the generateMap function.
 * 
 * @remarks
 * This type defines all configuration options for generating Sitecore component maps.
 * Component maps can be generated as a single file or split into server/client variants.
 * @public
 */
export type GenerateMapArgs = {
  /** Array of component paths to include in component map. */
  paths: string[];
  /** Destination folder path for the generated map. @defaultValue 'src/.sitecore' */
  destination?: string;
  /** Optional array of package definitions for component imports to include in the map. */
  componentImports?: ComponentImport[];
  /** Optional array of glob paths to exclude from the map. */
  exclude?: string[];
  /** Optional custom template function to generate the main component map content. */
  mapTemplate?: ComponentMapTemplate | EnhancedComponentMapTemplate;
  /**
   * Optional custom template function to generate the client component map content (only used when clientComponentMap is true).
   */
  clientMapTemplate?: ComponentMapTemplate | EnhancedComponentMapTemplate;
  /**
   * Optional flag to generate separate client and server component maps. When true,
   * generates both component-map.ts (all components) and component-map.client.ts (client + universal only).
   * When false or undefined, generates single component-map.ts (traditional behavior).
   */
  clientComponentMap?: boolean;
  /** Optional flag to include component's variants path in the component map. */
  includeVariants?: boolean;
};
