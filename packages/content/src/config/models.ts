import type { DeepRequired } from '@sitecore-content-sdk/core';
import type { SitecoreConfigInput as CoreSitecoreConfigInput } from '@sitecore-content-sdk/core';
import { GenerateMapFunction, GenerateMapArgs } from '../tools';

export type { DeepRequired } from '@sitecore-content-sdk/core';

/**
 * Utility type to make all properties in a type optional, recursively
 * @internal
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Design-token theming mode from `sitecore.config` `theming.mode`.
 * @public
 */
export type ThemingMode = 'none' | 'site';

/**
 * Type to be used as config input in sitecore.config
 * @public
 */
export type SitecoreConfigInput = CoreSitecoreConfigInput & {
  /**
   * Design-token theming from `sitecore.config`. Independent from Design Library `enableThemes` stylesheets.
   * Default is off so existing apps are unchanged.
   */
  theming?: {
    /**
     * Theming mode.
     * `none` (default) adds no theme links.
     * `site` adds the site-level design-token stylesheet when site name and client context id are available.
     * @default 'none'
     */
    mode?: ThemingMode;
  };
};

/**
 * Final Sitecore config type used at runtime.
 * Every property is populated, either from sitecore.config or fallback values.
 * @public
 */
export type SitecoreConfig = DeepRequired<SitecoreConfigInput>;

/**
 * Type used as CLI config input in sitecore.cli.config
 * @public
 */
export type SitecoreCliConfigInput = {
  /**
   * Sitecore configuration (`sitecore.config` file)
   */
  config: SitecoreConfig;
  /**
   * Configuration for the `sitecore-tools build` CLI command
   */
  build?: {
    /**
     * Commands to run during the build process
     */
    commands?: Array<(args?: { scConfig: SitecoreConfig }) => Promise<void>>;
  };
  /**
   * Configuration for the `sitecore-tools scaffold` CLI command
   */
  scaffold?: {
    /**
     * Scaffold templates available for generating components
     */
    templates?: ScaffoldTemplate[];
  };
  /**
   * Configuration for the `sitecore-tools component generate-map` CLI command
   */
  componentMap?: GenerateMapArgs & {
    /**
     * Function implementation for generating a component map
     */
    generator?: GenerateMapFunction;
  };
  /**
   * Configuration for the `sitecore-tools project atoms` CLI commands.
   */
  atoms?: {
    /**
     * Validation configuration for atoms.
     */
    validation?: {
      /**
       * When true, the CLI will exit with a non-zero code on validation errors.
       * Useful for CI pipelines that should fail on broken atom contracts.
       * @default false
       */
      breakOnError?: boolean;
    };
  };
};

/**
 * Final Sitecore CLI config type required by the CLI.
 * @public
 */
export type SitecoreCliConfig = DeepRequired<SitecoreCliConfigInput>;

/**
 * Represents a scaffold template used for generating components
 * @public
 */
export type ScaffoldTemplate = {
  /**
   * Name of the template
   */
  name: string;
  /**
   * File extension for the generated component
   */
  fileExtension: string;
  /**
   * Function to generate the component file contents based on the component name.
   * @param componentName - The name of the component.
   * @returns The generated content as a string.
   */
  generateTemplate: (componentName: string) => string;
  /**
   * Optional function to get the next steps to be shown by the cli after generating the component.
   * @param componentOutputPath - The output path of the generated component.
   * @returns An array of strings representing the next steps.
   */
  getNextSteps?: (componentOutputPath: string) => string[];
};

/**
 * Enumeration of default component templates
 * @internal
 */
export enum ComponentTemplateType {
  BYOC = 'byoc',
  DEFAULT = 'default',
}
