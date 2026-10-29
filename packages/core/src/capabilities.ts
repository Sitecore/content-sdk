import type { SitecoreConfig } from './sitecore-config';

/**
 * Sitecore configuration exposed to capability filters.
 * @public
 */
export type CapabilitySitecoreConfig = Pick<SitecoreConfig, 'disableCodeGeneration'>;

/**
 * Metadata associated with a capability.
 * @public
 */
export type CapabilityMetadata = Record<string, unknown>;

/**
 * Determines whether a capability exported by an installed package is used by the application.
 * @public
 */
export type CapabilityFilter = (context: CapabilityFilterContext) => boolean | Promise<boolean>;

/**
 * Filesystem access exposed to capability filters at application build time.
 * @public
 */
export type CapabilityFilterContext = {
  /** Absolute path to the application root. */
  appRoot: string;
  /** Resolved Sitecore configuration supplied to the metadata build command. */
  sitecoreConfig?: CapabilitySitecoreConfig;
  /** Tests whether a path relative to the application root exists. */
  fileExists: (relativePath: string) => boolean;
  /** Reads a UTF-8 file relative to the application root, or returns undefined. */
  readFile: (relativePath: string) => string | undefined;
  /** Tests whether one of the supplied files contains a string or regular expression. */
  fileContains: (relativePaths: string[], pattern: string | RegExp) => boolean;
};

/**
 * A named map of capabilities.
 * @public
 */
export type CapabilityMap<T> = Record<string, T>;

/**
 * A capability offered by a package.
 * @public
 */
export type CapabilityDefinition = {
  /** Whether the capability is offered. */
  value: boolean | CapabilityMap<CapabilityDefinition>;
  /** Optional build-time check that the application uses the capability. */
  filter?: CapabilityFilter;
  /** Optional metadata about the capability. */
  metadata?: CapabilityMetadata;
};

/**
 * Contract containing every capability packages may export.
 * @public
 */
export type CSDKCapabilities = {
  /** Allows item preview through the editing render endpoint. */
  preview?: CapabilityDefinition & {
    /** Allows preview for a specific point in time through the editing render endpoint. */
    timeBasedPreview?: CapabilityDefinition;
  };
  /** Allows item editing through the editing render endpoint. */
  editing?: CapabilityDefinition;
  /** Allows setting up and displaying personalization-based A/B tests. */
  abTesting?: CapabilityDefinition;
  /** Allows rendering BYOC components. */
  byocRender?: CapabilityDefinition;
  /** Allows rendering FEaaS components. */
  feaasRender?: CapabilityDefinition;
  /**
   * Allows Design Studio to render components dynamically.
   * Sub-capabilities are optional because each package exports only the ones it provides.
   */
  designLibrary?: CapabilityDefinition & {
    value: {
      /** Allows AI-based code generation and component generation. */
      variantGeneration?: CapabilityDefinition;
      /** Allows previewing AI-generated components. */
      variantPreview?: CapabilityDefinition;
      /** Allows the CLI to create a generated component in the local filesystem. */
      aiComponentExport?: CapabilityDefinition;
    };
  };
};

/**
 * A resolved capability written to application metadata.
 * Sub-capabilities are nested directly alongside the reserved `metadata` property.
 * @public
 */
export type ResolvedCapability =
  | true
  | {
      [key: string]: ResolvedCapability | CapabilityMetadata | undefined;
      metadata?: CapabilityMetadata;
    };

/**
 * Resolved capabilities written to the `capabilities` section of application metadata.
 * @public
 */
export type ResolvedCapabilities = CapabilityMap<ResolvedCapability>;

/**
 * Shape of a package's `/capabilities` submodule.
 * @public
 */
export type CapabilitiesModule = {
  default: CSDKCapabilities;
};
