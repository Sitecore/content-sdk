import fs from 'fs';
import path from 'path';
import debug from '../../debug';
import type {
  CapabilitiesModule,
  CapabilityDefinition,
  CapabilityFilter,
  CapabilityFilterContext,
  CapabilityMap,
  CapabilityMetadata,
  CapabilitySitecoreConfig,
  CSDKCapabilities,
  ResolvedCapabilities,
} from '../../capabilities';
import {
  isMissingAppModuleSubpath,
  loadAppModule,
  resolveContentSdkPackageNames,
} from '../framework-packages';

/** @internal */
export type CollectedCapabilities = {
  packageName: string;
  capabilities: CSDKCapabilities;
};

/** @internal */
export type MergedCapability = {
  value: boolean | MergedCapabilityTree;
  filters: CapabilityFilter[];
  metadata: CapabilityMetadata;
};

/** @internal */
export type MergedCapabilityTree = {
  [key: string]: MergedCapability;
};

/**
 * Loads capability exports from the Content SDK packages used by an application.
 * @param {string} [appRoot] application root
 * @returns package capability exports
 * @internal
 */
export function collectCapabilities(appRoot = process.cwd()): CollectedCapabilities[] {
  const packageNames = resolveContentSdkPackageNames(appRoot) ?? [];

  return packageNames.reduce<CollectedCapabilities[]>((result, packageName) => {
    const specifier = `${packageName}/capabilities`;
    try {
      const module = loadAppModule<CapabilitiesModule>(specifier, appRoot);
      if (module?.default && typeof module.default === 'object') {
        result.push({ packageName, capabilities: module.default });
      }
    } catch (error) {
      if (!isMissingAppModuleSubpath(error, specifier, appRoot)) {
        debug.common('Failed to load capabilities from %s: %O', packageName, error);
      }
    }

    return result;
  }, []);
}

/**
 * Merges package capability trees into one intermediary tree.
 * @param {CollectedCapabilities[]} packages collected package exports
 * @returns merged capability tree
 * @internal
 */
export function mergeCapabilityExports(packages: CollectedCapabilities[]): MergedCapabilityTree {
  return packages.reduce<MergedCapabilityTree>((merged, entry) => {
    Object.entries(entry.capabilities).forEach(([key, capability]) => {
      if (capability && isCapabilityDefinition(capability)) {
        merged[key] = mergeCapability(merged[key], capability, key);
      }
    });
    return merged;
  }, {});
}

/**
 * Merges one capability node.
 * @param {MergedCapability | undefined} current current node
 * @param {CapabilityDefinition} incoming incoming node
 * @param {string} key capability path
 * @returns merged node
 */
function mergeCapability(
  current: MergedCapability | undefined,
  incoming: CapabilityDefinition,
  key: string
): MergedCapability {
  const filters = [...(current?.filters ?? []), ...(incoming.filter ? [incoming.filter] : [])];
  const metadata = { ...current?.metadata, ...incoming.metadata };

  if (typeof incoming.value === 'boolean') {
    if (current && typeof current.value !== 'boolean') {
      debug.common(
        'Capability "%s" is exported as both a boolean and sub-capabilities; preserving sub-capabilities',
        key
      );
      return { value: current.value, filters, metadata };
    }

    return {
      value: (typeof current?.value === 'boolean' ? current.value : false) || incoming.value,
      filters,
      metadata,
    };
  }

  if (current && typeof current.value === 'boolean') {
    debug.common(
      'Capability "%s" is exported as both a boolean and sub-capabilities; preserving sub-capabilities',
      key
    );
  }

  const currentTree = current && typeof current.value !== 'boolean' ? current.value : {};
  return {
    value: mergeCapabilityTree(currentTree, incoming.value, key),
    filters,
    metadata,
  };
}

/**
 * Deeply merges a capability subtree.
 * @param {MergedCapabilityTree} current current tree
 * @param {CapabilityMap<CapabilityDefinition>} incoming incoming tree
 * @param {string} parentKey parent capability path
 * @returns merged tree
 */
function mergeCapabilityTree(
  current: MergedCapabilityTree,
  incoming: CapabilityMap<CapabilityDefinition>,
  parentKey: string
): MergedCapabilityTree {
  const merged = { ...current };
  Object.entries(incoming).forEach(([key, capability]) => {
    if (isCapabilityDefinition(capability)) {
      merged[key] = mergeCapability(merged[key], capability, `${parentKey}.${key}`);
    }
  });
  return merged;
}

/**
 * Validates a capability node.
 * @param {unknown} value candidate value
 * @returns whether the value is a capability node
 */
function isCapabilityDefinition(value: unknown): value is CapabilityDefinition {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    (typeof value.value === 'boolean' ||
      (typeof value.value === 'object' && value.value !== null))
  );
}

/**
 * Resolves filters and removes disabled capabilities.
 * @param {MergedCapabilityTree} capabilities merged capability tree
 * @param {CapabilityFilterContext} context application inspection context
 * @returns enabled capability keys
 * @internal
 */
export async function resolveCapabilities(
  capabilities: MergedCapabilityTree,
  context: CapabilityFilterContext
): Promise<ResolvedCapabilities> {
  const entries = await Promise.all(
    Object.entries(capabilities).map(async ([key, capability]) => {
      const filtersPass = await runFilters(capability.filters, context, key);
      if (!filtersPass) {
        return undefined;
      }

      const hasMetadata = Object.keys(capability.metadata).length > 0;

      if (typeof capability.value === 'boolean') {
        if (!capability.value) {
          return undefined;
        }

        return hasMetadata
          ? ([
              key,
              {
                metadata: capability.metadata,
              },
            ] as const)
          : ([key, true] as const);
      }

      const subCapabilities = await resolveCapabilities(capability.value, context);
      if (!Object.keys(subCapabilities).length && !hasMetadata) {
        return undefined;
      }

      return [
        key,
        {
          ...subCapabilities,
          ...(hasMetadata ? { metadata: capability.metadata } : {}),
        },
      ] as const;
    })
  );

  return Object.fromEntries(entries.filter((entry) => entry !== undefined));
}

/**
 * Runs every filter attached to a capability.
 * @param {CapabilityFilter[]} filters capability filters
 * @param {CapabilityFilterContext} context application context
 * @param {string} key capability path
 * @returns whether all filters pass
 */
async function runFilters(
  filters: CapabilityFilter[],
  context: CapabilityFilterContext,
  key: string
): Promise<boolean> {
  try {
    const results = await Promise.all(filters.map((filter) => filter(context)));
    return results.every(Boolean);
  } catch (error) {
    debug.common('Capability filter failed for "%s": %O', key, error);
    return false;
  }
}

/**
 * Creates an application filesystem context for capability filters.
 * @param {string} [appRoot] application root
 * @param {CapabilitySitecoreConfig} [sitecoreConfig] resolved Sitecore configuration
 * @returns filter context
 * @internal
 */
export function createCapabilityFilterContext(
  appRoot = process.cwd(),
  sitecoreConfig?: CapabilitySitecoreConfig
): CapabilityFilterContext {
  const resolvePath = (relativePath: string) => path.resolve(appRoot, relativePath);
  const readFile = (relativePath: string): string | undefined => {
    try {
      return fs.readFileSync(resolvePath(relativePath), 'utf8');
    } catch {
      return undefined;
    }
  };

  return {
    appRoot: path.resolve(appRoot),
    sitecoreConfig,
    fileExists: (relativePath) => fs.existsSync(resolvePath(relativePath)),
    readFile,
    fileContains: (relativePaths, pattern) =>
      relativePaths.some((relativePath) => {
        const contents = readFile(relativePath);
        if (contents === undefined) {
          return false;
        }
        if (typeof pattern === 'string') {
          return contents.includes(pattern);
        }
        pattern.lastIndex = 0;
        return pattern.test(contents);
      }),
  };
}

/**
 * Calculates enabled capabilities for an application.
 * @param {{ appRoot?: string, sitecoreConfig?: CapabilitySitecoreConfig }} [config] calculation configuration
 * @param {string} [config.appRoot] application root
 * @param {CapabilitySitecoreConfig} [config.sitecoreConfig] resolved Sitecore configuration
 * @returns enabled capability keys
 * @public
 */
export async function calculateCapabilities(config?: {
  appRoot?: string;
  sitecoreConfig?: CapabilitySitecoreConfig;
}): Promise<ResolvedCapabilities> {
  const appRoot = config?.appRoot ?? process.cwd();
  const collected = collectCapabilities(appRoot);
  const merged = mergeCapabilityExports(collected);
  return resolveCapabilities(
    merged,
    createCapabilityFilterContext(appRoot, config?.sitecoreConfig)
  );
}
