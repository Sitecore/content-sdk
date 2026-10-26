import type {
  DeepRequired,
  SitecoreConfig,
} from '@sitecore-content-sdk/core';
import { GenerateMapFunction, GenerateMapArgs } from '../tools';

export type {
  DeepRequired,
  SitecoreConfig,
  SitecoreConfigInput,
} from '@sitecore-content-sdk/core';

/**
 * Utility type to make all properties in a type optional, recursively.
 * @internal
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Type used as CLI config input in sitecore.cli.config.
 * @public
 */
export type SitecoreCliConfigInput = {
  /** Sitecore configuration (`sitecore.config` file). */
  config: SitecoreConfig;
  /** Configuration for the `sitecore-tools build` CLI command. */
  build?: {
    /** Commands to run during the build process. */
    commands?: Array<(args?: { scConfig: SitecoreConfig }) => Promise<void>>;
  };
  /** Configuration for the `sitecore-tools scaffold` CLI command. */
  scaffold?: {
    /** Scaffold templates available for generating components. */
    templates?: ScaffoldTemplate[];
  };
  /** Configuration for the component map generator. */
  componentMap?: GenerateMapArgs & {
    /** Function implementation for generating a component map. */
    generator?: GenerateMapFunction;
  };
};

/**
 * Final Sitecore CLI config type required by the CLI.
 * @public
 */
export type SitecoreCliConfig = DeepRequired<SitecoreCliConfigInput>;

/**
 * Represents a scaffold template used by component generation.
 * @public
 */
export type ScaffoldTemplate = {
  /** Template name. */
  name: string;
  /** File extension for the generated component. */
  fileExtension: string;
  /**
   * Generates component file contents.
   * @param componentName component name
   * @returns generated component source
   */
  generateTemplate: (componentName: string) => string;
  /**
   * Gets next steps shown after generating the component.
   * @param componentOutputPath generated component output path
   * @returns next-step messages
   */
  getNextSteps?: (componentOutputPath: string) => string[];
};

/**
 * Enumeration of default component templates.
 * @internal
 */
export enum ComponentTemplateType {
  BYOC = 'byoc',
  DEFAULT = 'default',
}
